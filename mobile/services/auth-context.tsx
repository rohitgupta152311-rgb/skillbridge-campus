import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage } from './storage';
import { MobileApi } from './api';

export interface MobileUser {
  id: string;
  email: string;
  role: 'MENTEE' | 'MENTOR' | 'FACULTY' | 'ALUMNI' | 'ADMIN';
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
