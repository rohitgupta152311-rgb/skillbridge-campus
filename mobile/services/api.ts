import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Storage } from './storage';

// In development, Android emulator connects to host computer via 10.0.2.2, iOS via localhost
const DEFAULT_DEV_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api/v1' : 'http://localhost:5000/api/v1';
const PROD_API = Constants.expoConfig?.extra?.productionApiUrl || 'https://skillbridge-backend-15a7.onrender.com/api/v1';

export const API_URL = (process.env.EXPO_PUBLIC_USE_LOCAL === 'true') ? DEFAULT_DEV_HOST : PROD_API;

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await Storage.getItem('sb_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  
  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    
    return data;
  } catch (error: any) {
    console.warn(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

export function clearCache(pattern?: string) {
  if (!pattern) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
    }
  }
}

export async function requestCached<T>(endpoint: string, ttlMs = 30000, options: RequestInit = {}): Promise<T> {
  const cached = memoryCache.get(endpoint);
  const now = Date.now();

  // If cached and still valid, return instantaneously (0ms UI latency)
  if (cached && (now - cached.timestamp < ttlMs)) {
    return cached.data;
  }

  const data = await request<T>(endpoint, options);
  memoryCache.set(endpoint, { data, timestamp: now });
  return data;
}

export const MobileApi = {
  // Auth
  login: (email: string, password: string) =>
    request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (payload: any) =>
    request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  exchangeOAuth: (provider: 'linkedin' | 'google' | 'github', code: string, redirectUri?: string) =>
    request<any>('/auth/oauth/exchange', {
      method: 'POST',
      body: JSON.stringify({ provider, code, redirectUri }),
    }),

  confirmLinkedInImport: (payload: any) =>
    request<any>('/auth/linkedin/confirm-import', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () => request<any>('/auth/me'),

  // Feed & Posts (SWR cached for 15s instant tab loading)
  getFeed: () => requestCached<any>('/posts/feed', 15000),
  createPost: async (postData: { content: string; postType?: string; tags?: string[]; mediaUrls?: string[] }) => {
    clearCache('/posts/feed');
    return request<any>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },
  likePost: async (postId: string) => {
    clearCache('/posts/feed');
    return request<any>(`/posts/${postId}/react`, {
      method: 'POST',
      body: JSON.stringify({ type: 'LIKE' }),
    });
  },
  addComment: async (postId: string, content: string) => {
    clearCache('/posts/feed');
    return request<any>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  // Networking & Connections (SWR cached for 30s)
  getConnections: () => requestCached<any>('/network/connections', 30000),
  getSuggestions: () => requestCached<any>('/network/suggestions', 30000),
  sendRequest: async (receiverId: string) => {
    clearCache('/network');
    return request<any>('/network/request', {
      method: 'POST',
      body: JSON.stringify({ receiverId }),
    });
  },
  respondRequest: async (connectionId: string, status: 'ACCEPTED' | 'REJECTED') => {
    clearCache('/network');
    return request<any>(`/network/respond/${connectionId}`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },

  // Mentorship & Matchmaker (SWR cached for 30s)
  getMentors: (topic?: string) =>
    requestCached<any>(`/mentorship/mentors${topic ? `?topic=${encodeURIComponent(topic)}` : ''}`, 30000),
  getMatches: (preferences: any) =>
    request<any>('/mentorship/smart-match', {
      method: 'POST',
      body: JSON.stringify(preferences),
    }),
  bookSession: async (bookingData: any) => {
    clearCache('/mentorship');
    return request<any>('/mentorship/sessions/book', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Messages (SWR cached for 10s)
  getConversations: () => requestCached<any>('/messages/conversations', 10000),
  getMessages: (conversationId: string) => requestCached<any>(`/messages/${conversationId}`, 8000),
  sendMessage: async (conversationId: string, content: string) => {
    clearCache('/messages');
    return request<any>(`/messages/${conversationId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  // Image Upload
  uploadImage: (base64DataUri: string, folder = 'posts') =>
    request<any>('/uploads/image', {
      method: 'POST',
      body: JSON.stringify({ image: base64DataUri, folder }),
    }),

  // Version Check
  checkVersion: () => request<any>('/auth/version'),

  // Admin Controls
  getAdminUsers: (status = 'ALL') => request<any>(`/admin/users?status=${status}&limit=50`),
  approveUser: (userId: string) => request<any>(`/admin/users/${userId}/approve`, { method: 'PUT' }),
  deleteUser: (userId: string) => request<any>(`/admin/users/${userId}`, { method: 'DELETE' }),
};
