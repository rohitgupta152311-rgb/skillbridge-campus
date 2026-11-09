import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage } from './storage';
import { MobileApi } from './api';

export interface MobileUser {
  id: string;
  email: string;
  role: 'MENTEE' | 'MENTOR' | 'FACULTY' | 'ALUMNI' | 'ADMIN';
  isVerified?: boolean;
  isSuspended?: boolean;
  profile?: {
    fullName: string;
    avatarUrl?: string;
    headline?: string;
    department: string;
    currentYear: string;
    university: string;
    linkedinUrl?: string;
    githubUrl?: string;
  };
}

interface AuthContextType {
  user: MobileUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithOAuth: (authUser: MobileUser, authToken: string) => Promise<void>;
  loginWithGoogle: (payload: { email: string; fullName?: string; avatarUrl?: string }) => Promise<boolean>;
  loginWithGitHub: (payload: { username: string; email?: string }) => Promise<{ success: boolean; error?: string }>;
  sendRegistrationOtp: (payload: any) => Promise<{ success: boolean; message?: string; data?: any }>;
  verifyRegistrationOtp: (payload: any) => Promise<{ success: boolean; message?: string; data?: any }>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<MobileUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MobileUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStoredSession();
  }, []);

  const loadStoredSession = async () => {
    try {
      const storedToken = await Storage.getItem('sb_auth_token');
      const storedUser = await Storage.getItem('sb_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Failed to load local session:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await MobileApi.login(email, password);
      if (res.success && res.data) {
        const authToken = res.data.token;
        const authUser = res.data.user;

        await Storage.setItem('sb_auth_token', authToken);
        await Storage.setItem('sb_user', JSON.stringify(authUser));

        setToken(authToken);
        setUser(authUser);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const loginWithGoogle = async (payload: { email: string; fullName?: string; avatarUrl?: string }): Promise<boolean> => {
    try {
      const res = await MobileApi.authenticateWithGoogle(payload);
      if (res.success && res.data) {
        const authToken = res.data.token;
        const authUser = res.data.user;

        await Storage.setItem('sb_auth_token', authToken);
        await Storage.setItem('sb_user', JSON.stringify(authUser));

        setToken(authToken);
        setUser(authUser);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const loginWithGitHub = async (payload: { username: string; email?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await MobileApi.authenticateWithGitHub(payload);
      if (res.success && res.data) {
        const authToken = res.data.token;
        const authUser = res.data.user;

        await Storage.setItem('sb_auth_token', authToken);
        await Storage.setItem('sb_user', JSON.stringify(authUser));

        setToken(authToken);
        setUser(authUser);
        return { success: true };
      }
      return { success: false, error: res.message || 'GitHub authentication failed' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error during GitHub authentication' };
    }
  };

  const sendRegistrationOtp = async (payload: any): Promise<{ success: boolean; message?: string; data?: any }> => {
    try {
      const res = await MobileApi.sendRegistrationOtp(payload);
      return res;
    } catch (e: any) {
      return { success: false, message: e?.message || 'Failed to dispatch verification code.' };
    }
  };

  const verifyRegistrationOtp = async (payload: any): Promise<{ success: boolean; message?: string; data?: any }> => {
    try {
      const res = await MobileApi.verifyRegistrationOtp(payload);
      if (res.success && res.data) {
        const authToken = res.data.token;
        const authUser = res.data.user;

        await Storage.setItem('sb_auth_token', authToken);
        await Storage.setItem('sb_user', JSON.stringify(authUser));

        setToken(authToken);
        setUser(authUser);
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message || 'Invalid verification code.' };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Verification failed.' };
    }
  };

  const loginWithOAuth = async (authUser: MobileUser, authToken: string): Promise<void> => {
    await Storage.setItem('sb_auth_token', authToken);
    await Storage.setItem('sb_user', JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  };

  const logout = async () => {
    await Storage.removeItem('sb_auth_token');
    await Storage.removeItem('sb_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithOAuth,
        loginWithGoogle,
        loginWithGitHub,
        sendRegistrationOtp,
        verifyRegistrationOtp,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
