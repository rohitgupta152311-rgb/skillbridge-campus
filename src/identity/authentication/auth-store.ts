import { create } from 'zustand';
import { User, UserRole } from '../../foundation/types';
import { getUserByEmail, getUserById, addUser, updateUser as updateLocalUser, initializeDataStore } from '../../infrastructure/local-storage/data-service';
import { DEMO_CREDENTIALS } from '../../foundation/constants';
import { apiClient, setAuthSession, clearAuthSession, getAuthToken } from '../../infrastructure/api/api-client';

export interface OAuthProfileData {
  email: string;
  fullName: string;
  avatar?: string;
  role?: UserRole;
  department?: string;
  year?: string;
  headline?: string;
  provider: 'google' | 'github' | 'linkedin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  sendRegistrationOtp: (data: RegisterData) => Promise<{ success: boolean; message?: string; devCode?: string }>;
  verifyRegistrationOtp: (email: string, code: string, registerData?: RegisterData) => Promise<{ success: boolean; message?: string }>;
  loginWithOAuth: (profile: OAuthProfileData) => Promise<boolean>;
  loginWithGoogle: (payload: { email: string; fullName?: string; avatarUrl?: string }) => Promise<boolean>;
  loginWithGitHub: (username: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithFirebase: (idToken: string, extraProfile?: { role?: UserRole; department?: string; year?: string; university?: string }) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  syncDatabaseProfile: () => Promise<void>;
  updateUser: (partial: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  department: string;
  year: string;
}

const AUTH_KEY = 'sb_current_user';

function mapBackendUserToFrontend(backendUser: any, token: string): User {
  const profile = backendUser.profile || {};
  return {
    id: backendUser.id,
    email: backendUser.email,
    fullName: profile.fullName || (typeof backendUser.email === 'string' && backendUser.email.includes('@') ? backendUser.email.split('@')[0] : 'Campus Student'),
    avatar: profile.avatarUrl || '',
    role: (backendUser.role || 'mentee').toLowerCase() as UserRole,
    department: profile.department || 'General Engineering',
    year: profile.currentYear || '1st Year',
    university: profile.university || 'NIT Nagaland',
    bio: profile.bio || '',
    headline: profile.headline || '',
    portfolioUrl: profile.portfolioUrl || '',
    githubUrl: profile.githubUrl || '',
    linkedinUrl: profile.linkedinUrl || '',
    isVerified: backendUser.isVerified !== undefined ? backendUser.isVerified : true,
    isSuspended: backendUser.isSuspended || false,
    joinedAt: backendUser.createdAt || new Date().toISOString(),
    learningPreferences: ['visual', 'kinesthetic'],
    languages: profile.languages && profile.languages.length ? profile.languages : ['English'],
    onlineStatus: 'available',
    token,
    accounts: Array.isArray(backendUser.accounts) ? backendUser.accounts : [],
  };
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Initialize local data store
  initializeDataStore();

  // Restore session
  const stored = localStorage.getItem(AUTH_KEY);
  let initialUser: User | null = null;
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.id) {
        initialUser = parsed;
      }
    } catch { /* ignore */ }
  }

  // If initialUser has token or sb_auth_token exists, sync from PostgreSQL
  const token = getAuthToken();
  if (token && initialUser) {
    setTimeout(async () => {
      try {
        const me = await apiClient.getMe();
        if (me && me.id) {
          const freshUser = mapBackendUserToFrontend(me, token);
          setAuthSession(token, freshUser);
          set({ user: freshUser, isAuthenticated: true });
        }
      } catch {
        // Retain offline session
      }
    }, 100);
  }

  return {
    user: initialUser,
    isAuthenticated: !!initialUser,
    isLoading: false,
    error: null,

    syncDatabaseProfile: async () => {
      const currentToken = getAuthToken();
      if (!currentToken) return;
      try {
        const me = await apiClient.getMe();
        if (me && me.id) {
          const freshUser = mapBackendUserToFrontend(me, currentToken);
          setAuthSession(currentToken, freshUser);
          set({ user: freshUser });
        }
      } catch {
        // Ignore
      }
    },

    login: async (email: string, password: string): Promise<boolean> => {
      set({ isLoading: true, error: null });

      // 1. Try real backend database login
      const result = await apiClient.login({ email, password });
      if (result.success && result.data) {
        if (result.data.user && result.data.user.isVerified === false && String(result.data.user.role).toUpperCase() !== 'ADMIN') {
          set({
            isLoading: false,
            error: 'Your account is pending administrator approval. Please wait for an administrator to review and activate your campus account.',
          });
          return false;
        }

        const userObj = mapBackendUserToFrontend(result.data.user, result.data.token);
        userObj.isVerified = true;
        userObj.isSuspended = false;
        
        // Ensure user is recorded in local data store for components
        if (!getUserById(userObj.id)) {
          addUser(userObj);
        } else {
          updateLocalUser(userObj.id, userObj);
        }

        setAuthSession(result.data.token, userObj);
        set({ user: userObj, isAuthenticated: true, isLoading: false, error: null });
        return true;
      }

      // If backend explicitly indicated pending approval
      if (result.message && (result.message.toLowerCase().includes('pending') || result.message.toLowerCase().includes('approval'))) {
        set({
          isLoading: false,
          error: result.message,
        });
        return false;
      }

      // 2. Demo credentials fallback (for offline or local demo accounts)
      const isDemoPass = password === 'demo1234' || password === 'admin1234' ||
        (email === DEMO_CREDENTIALS.student.email && password === DEMO_CREDENTIALS.student.password) ||
        (email === DEMO_CREDENTIALS.mentor.email && password === DEMO_CREDENTIALS.mentor.password) ||
        (email === DEMO_CREDENTIALS.admin.email && password === DEMO_CREDENTIALS.admin.password) ||
        (email === DEMO_CREDENTIALS.rohit.email && password === DEMO_CREDENTIALS.rohit.password) ||
        (email === DEMO_CREDENTIALS.vidya.email && password === DEMO_CREDENTIALS.vidya.password) ||
        (email === DEMO_CREDENTIALS.nyoimei.email && password === DEMO_CREDENTIALS.nyoimei.password) ||
        (email === DEMO_CREDENTIALS.salini.email && password === DEMO_CREDENTIALS.salini.password) ||
        (email === DEMO_CREDENTIALS.kasturika.email && password === DEMO_CREDENTIALS.kasturika.password) ||
        (email === DEMO_CREDENTIALS.betimansa.email && password === DEMO_CREDENTIALS.betimansa.password);

      if (isDemoPass) {
        const localUser = getUserByEmail(email);
        if (localUser) {
          if (localUser.isSuspended) {
            set({ isLoading: false, error: 'This account has been suspended' });
            return false;
          }
          if (!localUser.isVerified && localUser.role !== 'admin') {
            set({
              isLoading: false,
              error: 'Your account is pending administrator approval. Please wait for an administrator to review and activate your campus account.',
            });
            return false;
          }
          setAuthSession('demo-token', localUser);
          set({ user: localUser, isAuthenticated: true, isLoading: false, error: null });
          return true;
        }
      }

      set({
        isLoading: false,
        error: result.message || 'Invalid email or password. Please verify your credentials.',
      });
      return false;
    },

    sendRegistrationOtp: async (data: RegisterData): Promise<{ success: boolean; message?: string; devCode?: string }> => {
      set({ isLoading: true, error: null });
      const result = await apiClient.sendRegistrationOtp({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
        role: data.role,
        department: data.department,
        year: data.year,
        university: 'NIT Nagaland',
      });
      set({ isLoading: false });
      if (result.success && result.data) {
        return {
          success: true,
          message: result.message,
          devCode: result.data.devCode,
        };
      }
      const errMsg = result.message || 'Failed to dispatch verification code.';
      set({ error: errMsg });
      return { success: false, message: errMsg };
    },

    verifyRegistrationOtp: async (email: string, code: string, registerData?: RegisterData): Promise<{ success: boolean; message?: string }> => {
      set({ isLoading: true, error: null });
      const result = await apiClient.verifyRegistrationOtp({
        email,
        code,
        registrationData: registerData ? {
          fullName: registerData.fullName,
          password: registerData.password,
          role: registerData.role,
          department: registerData.department,
          year: registerData.year,
          university: 'NIT Nagaland',
        } : undefined,
      });

      if (result.success && result.data) {
        const userObj = mapBackendUserToFrontend(result.data.user, result.data.token);
        userObj.isVerified = true;
        userObj.isSuspended = false;

        if (!getUserById(userObj.id)) {
          addUser(userObj);
        } else {
          updateLocalUser(userObj.id, userObj);
        }

        setAuthSession(result.data.token, userObj);
        set({ user: userObj, isAuthenticated: true, isLoading: false, error: null });
        return { success: true };
      }

      const errMsg = result.message || 'Invalid or expired verification code.';
      set({ isLoading: false, error: errMsg });
      return { success: false, message: errMsg };
    },

    register: async (data: RegisterData): Promise<boolean> => {
      set({ isLoading: true, error: null });

      // 1. Register with real production backend PostgreSQL database
      const result = await apiClient.register({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: data.role,
        department: data.department,
        year: data.year,
        university: 'NIT Nagaland',
      });

      if (result.success && result.data) {
        const newUser = mapBackendUserToFrontend(result.data.user, result.data.token || '');
        newUser.isVerified = false;
        addUser(newUser);

        set({ isLoading: false, error: null });
        return true;
      }

      // If backend registration failed with specific error (e.g. 409 email already exists)
      if (result.message && (result.message.includes('exists') || result.message.includes('already'))) {
        set({
          isLoading: false,
          error: 'An account with this email address already exists. Please log in instead.',
        });
        return false;
      }

      // Fallback: If network is completely offline, allow local creation pending approval
      const existingLocal = getUserByEmail(data.email);
      if (existingLocal) {
        set({ isLoading: false, error: 'An account with this email address already exists. Please log in instead.' });
        return false;
      }

      addUser({
        email: data.email,
        fullName: data.fullName,
        avatar: '',
        role: data.role,
        department: data.department,
        year: data.year,
        bio: '',
        isVerified: false,
        isSuspended: false,
        learningPreferences: [],
        languages: ['English'],
        onlineStatus: 'available',
      });

      set({ isLoading: false, error: null });
      return true;
    },

    loginWithGoogle: async (payload: { email: string; fullName?: string; avatarUrl?: string }): Promise<boolean> => {
      set({ isLoading: true, error: null });
      const result = await apiClient.authenticateWithGoogle(payload);
      if (result.success && result.data) {
        const userObj = mapBackendUserToFrontend(result.data.user, result.data.token);
        userObj.isVerified = true;
        userObj.isSuspended = false;

        if (!getUserById(userObj.id)) {
          addUser(userObj);
        } else {
          updateLocalUser(userObj.id, userObj);
        }

        setAuthSession(result.data.token, userObj);
        set({ user: userObj, isAuthenticated: true, isLoading: false, error: null });
        return true;
      }

      set({
        isLoading: false,
        error: result.message || 'Google authentication failed. Please try again.',
      });
      return false;
    },

    loginWithGitHub: async (username: string, email?: string): Promise<{ success: boolean; error?: string }> => {
      set({ isLoading: true, error: null });
      const result = await apiClient.authenticateWithGitHub({ username, email });
      if (result.success && result.data) {
        const userObj = mapBackendUserToFrontend(result.data.user, result.data.token);
        userObj.isVerified = true;
        userObj.isSuspended = false;

        if (!getUserById(userObj.id)) {
          addUser(userObj);
        } else {
          updateLocalUser(userObj.id, userObj);
        }

        setAuthSession(result.data.token, userObj);
        set({ user: userObj, isAuthenticated: true, isLoading: false, error: null });
        return { success: true };
      }

      const errMsg = result.message || 'GitHub authentication failed. Please check your username.';
      set({
        isLoading: false,
        error: errMsg,
      });
      return { success: false, error: errMsg };
    },

    loginWithOAuth: async (profile: OAuthProfileData): Promise<boolean> => {
      set({ isLoading: true, error: null });

      let user = getUserByEmail(profile.email);
      if (!user) {
        // Attempt backend register for OAuth user
        const regRes = await apiClient.register({
          email: profile.email,
          password: 'OAuth_Secure_User_' + Math.random().toString(36).slice(-8),
          fullName: profile.fullName,
          role: profile.role || 'mentee',
          department: profile.department || 'Computer Science',
          year: profile.year || '3rd Year',
          university: 'NIT Nagaland',
        });

        if (regRes.success && regRes.data) {
          user = mapBackendUserToFrontend(regRes.data.user, regRes.data.token);
          addUser(user);
        } else {
          user = addUser({
            email: profile.email,
            fullName: profile.fullName,
            avatar: profile.avatar || '',
            role: profile.role || 'mentee',
            department: profile.department || 'Computer Science',
            year: profile.year || '3rd Year',
            bio: profile.headline || `Student at Campus • Verified via ${profile.provider.toUpperCase()}`,
            isVerified: true,
            isSuspended: false,
            learningPreferences: ['visual', 'kinesthetic'],
            languages: ['English', 'Hindi'],
            onlineStatus: 'available',
          });
        }
      }

      setAuthSession(user.token || 'oauth-token', user);
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    },

    loginWithFirebase: async (idToken: string, extraProfile?: any): Promise<boolean> => {
      set({ isLoading: true, error: null });

      // 1. Send ID Token to backend to authenticate and sync PostgreSQL
      const result = await apiClient.loginWithFirebase({
        idToken,
        role: extraProfile?.role,
        department: extraProfile?.department,
        currentYear: extraProfile?.year,
        university: extraProfile?.university,
      });

      if (result.success && result.data) {
        const userObj = mapBackendUserToFrontend(result.data.user, result.data.token);
        userObj.isVerified = true;
        userObj.isSuspended = false;

        if (!getUserById(userObj.id)) {
          addUser(userObj);
        } else {
          updateLocalUser(userObj.id, userObj);
        }

        setAuthSession(result.data.token, userObj);
        set({ user: userObj, isAuthenticated: true, isLoading: false, error: null });
        return true;
      }

      set({
        isLoading: false,
        error: result.message || 'Firebase login failed. Please try again.',
      });
      return false;
    },

    logout: () => {
      clearAuthSession();
      set({ user: null, isAuthenticated: false, error: null });
    },

    updateUser: (partial: Partial<User>) => {
      const current = get().user;
      if (!current) return;
      const updated = { ...current, ...partial };
      set({ user: updated });
      setAuthSession(getAuthToken() || 'local-demo-token', updated);
      updateLocalUser(current.id, partial);
    },

    clearError: () => set({ error: null }),
  };
});
