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
  };
}

interface AuthContextType {
  user: MobileUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithDemo: (role: 'mentee' | 'mentor' | 'admin') => Promise<void>;
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
    } catch (e: any) {
      // In offline / local demo fallback
      const demoUser: MobileUser = {
        id: 'mentee-1',
        email,
        role: 'MENTEE',
        profile: {
          fullName: 'Alex Chen',
          department: 'Computer Science',
          currentYear: '3rd Year',
          university: 'State Technological University',
          headline: 'Junior Computer Science Major | Mobile Student',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        },
      };
      await Storage.setItem('sb_auth_token', 'offline-token-123');
      await Storage.setItem('sb_user', JSON.stringify(demoUser));
      setToken('offline-token-123');
      setUser(demoUser);
      return true;
    }
  };

  const loginWithDemo = async (role: 'mentee' | 'mentor' | 'admin') => {
    const demoProfiles: Record<string, MobileUser> = {
      mentee: {
        id: 'mentee-1',
        email: 'alex.student@campus.edu',
        role: 'MENTEE',
        profile: {
          fullName: 'Alex Chen',
          department: 'Computer Science',
          currentYear: '3rd Year',
          university: 'State Technological University',
          headline: 'Junior Computer Science Major | Mobile Peer',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        },
      },
      mentor: {
        id: 'mentor-1',
        email: 'sarah.mentor@campus.edu',
        role: 'MENTOR',
        profile: {
          fullName: 'Sarah Jenkins',
          department: 'Computer Science',
          currentYear: 'Graduate',
          university: 'State Technological University',
          headline: 'Distributed Systems TA & Peer Mentor',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        },
      },
      admin: {
        id: 'admin-1',
        email: 'admin@campus.edu',
        role: 'ADMIN',
        profile: {
          fullName: 'Campus Admin',
          department: 'Academic Affairs',
          currentYear: 'Staff',
          university: 'State Technological University',
          headline: 'Platform Safety Administrator',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        },
      },
    };

    const target = demoProfiles[role];
    const dummyToken = `demo-${role}-jwt-token`;
    await Storage.setItem('sb_auth_token', dummyToken);
    await Storage.setItem('sb_user', JSON.stringify(target));
    setToken(dummyToken);
    setUser(target);
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
        loginWithDemo,
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
