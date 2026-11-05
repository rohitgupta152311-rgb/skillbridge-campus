import { create } from 'zustand';
import { User, UserRole } from '../../foundation/types';
import { getUserByEmail, addUser, initializeDataStore } from '../../infrastructure/local-storage/data-service';
import { DEMO_CREDENTIALS } from '../../foundation/constants';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
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
      if (parsed && parsed.email !== 'alex.student@campus.edu') {
        initialUser = parsed;
      }
    } catch { /* ignore */ }
  }
  // Default to Rohit Gupta for authentic Indian campus community experience
  if (!initialUser) {
    initialUser = getUserByEmail('rohit.gupta@campus.edu') || null;
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
        (email === DEMO_CREDENTIALS.mentee.email && password === DEMO_CREDENTIALS.mentee.password) ||
        (email === DEMO_CREDENTIALS.mentor.email && password === DEMO_CREDENTIALS.mentor.password) ||
        (email === DEMO_CREDENTIALS.admin.email && password === DEMO_CREDENTIALS.admin.password) ||
        password === 'demo1234'; // Allow any registered user to log in with demo password

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

    logout: () => {
      localStorage.removeItem(AUTH_KEY);
      set({ user: null, isAuthenticated: false, error: null });
    },

    clearError: () => set({ error: null }),
  };
});
