import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Storage } from './storage';

// In development, Android emulator connects to host computer via 10.0.2.2, iOS via localhost
const DEFAULT_DEV_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api/v1' : 'http://localhost:5000/api/v1';
const PROD_API = Constants.expoConfig?.extra?.productionApiUrl || 'https://studybridge-api.onrender.com/api/v1';

export const API_URL = __DEV__ ? DEFAULT_DEV_HOST : PROD_API;

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

  // Feed & Posts
  getFeed: () => request<any>('/posts/feed'),
  createPost: (postData: { content: string; postType?: string; tags?: string[]; mediaUrls?: string[] }) =>
    request<any>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),
  likePost: (postId: string) =>
    request<any>(`/posts/${postId}/react`, {
      method: 'POST',
      body: JSON.stringify({ type: 'LIKE' }),
    }),
  addComment: (postId: string, content: string) =>
    request<any>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  // Networking & Connections
  getConnections: () => request<any>('/network/connections'),
  getSuggestions: () => request<any>('/network/suggestions'),
  sendRequest: (receiverId: string) =>
    request<any>('/network/request', {
      method: 'POST',
      body: JSON.stringify({ receiverId }),
    }),
  respondRequest: (connectionId: string, status: 'ACCEPTED' | 'REJECTED') =>
    request<any>(`/network/respond/${connectionId}`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),

  // Mentorship & Matchmaker
  getMentors: (topic?: string) =>
    request<any>(`/mentorship/mentors${topic ? `?topic=${encodeURIComponent(topic)}` : ''}`),
  getMatches: (preferences: any) =>
    request<any>('/mentorship/smart-match', {
      method: 'POST',
      body: JSON.stringify(preferences),
    }),
  bookSession: (bookingData: any) =>
    request<any>('/mentorship/sessions/book', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  // Messages
  getConversations: () => request<any>('/messages/conversations'),
  getMessages: (conversationId: string) => request<any>(`/messages/${conversationId}`),
  sendMessage: (conversationId: string, content: string) =>
    request<any>(`/messages/${conversationId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  // Image Upload
  uploadImage: (base64DataUri: string, folder = 'posts') =>
    request<any>('/uploads/image', {
      method: 'POST',
      body: JSON.stringify({ image: base64DataUri, folder }),
    }),

  // Version Check
  checkVersion: () => request<any>('/auth/version'),
};
