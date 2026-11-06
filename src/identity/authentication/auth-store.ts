import { create } from 'zustand';
import { User, UserRole } from '../../foundation/types';
import { getUserByEmail, getUserById, addUser, initializeDataStore } from '../../infrastructure/local-storage/data-service';
import { DEMO_CREDENTIALS } from '../../foundation/constants';

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
  loginWithOAuth: (profile: OAuthProfileData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
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

export const useAuthStore = create<AuthState>((set) => {
  // Initialize data store
  initializeDataStore();

  // Restore session
  const stored = localStorage.getItem(AUTH_KEY);
  let initialUser: User | null = null;
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.id && getUserById(parsed.id)) {
        initialUser = parsed;
      }
    } catch { /* ignore */ }
  }
  // Default to Vidya Gupta (NIT Nagaland 2nd Year EEE)
  if (!initialUser) {
    initialUser = getUserByEmail('vidya.gupta@campus.edu') || null;
    if (initialUser) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(initialUser));
    }
  }

  return {
    user: initialUser,
    isAuthenticated: !!initialUser,
    isLoading: false,
    error: null,

    login: async (email: string, password: string): Promise<boolean> => {
      set({ isLoading: true, error: null });
      // Simulate network delay
      await new Promise(r => setTimeout(r, 500));

      // Check demo credentials or any user with matching email
      const validCredentials =
        (email === DEMO_CREDENTIALS.student.email && password === DEMO_CREDENTIALS.student.password) ||
        (email === DEMO_CREDENTIALS.mentor.email && password === DEMO_CREDENTIALS.mentor.password) ||
        (email === DEMO_CREDENTIALS.admin.email && password === DEMO_CREDENTIALS.admin.password) ||
        password === 'demo1234' ||
        password === 'admin1234';

      if (!validCredentials) {
        set({ isLoading: false, error: 'Invalid email or password' });
        return false;
      }

      const user = getUserByEmail(email);
      if (!user) {
        set({ isLoading: false, error: 'No account found with this email' });
        return false;
      }

      if (user.isSuspended) {
        set({ isLoading: false, error: 'This account has been suspended' });
        return false;
      }

      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false, error: null });
      return true;
    },

    register: async (data: RegisterData): Promise<boolean> => {
      set({ isLoading: true, error: null });
      await new Promise(r => setTimeout(r, 500));

      const existing = getUserByEmail(data.email);
      if (existing) {
        set({ isLoading: false, error: 'An account with this email already exists' });
        return false;
      }

      const newUser = addUser({
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

      localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
      set({ user: newUser, isAuthenticated: true, isLoading: false });
      return true;
    },

    loginWithOAuth: async (profile: OAuthProfileData): Promise<boolean> => {
      set({ isLoading: true, error: null });
      await new Promise(r => setTimeout(r, 400));

      let user = getUserByEmail(profile.email);
      if (!user) {
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
      } else {
        // If user already exists, update verification and avatar if provided
        if (profile.avatar && (!user.avatar || user.avatar.includes('placeholder'))) {
          user.avatar = profile.avatar;
        }
        user.isVerified = true;
      }

      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false, error: null });
      return true;
    },

    logout: () => {
      localStorage.removeItem(AUTH_KEY);
      set({ user: null, isAuthenticated: false, error: null });
    },

    clearError: () => set({ error: null }),
  };
});
