import { Post, CommunityItem, SkillItem, Connection, User, MentorProfile, Conversation, Message } from '../../foundation/types';
import * as LocalData from '../local-storage/data-service';

// Use production Render backend as canonical default
const API_BASE = import.meta.env.VITE_API_URL || 'https://skillbridge-backend-15a7.onrender.com/api/v1';

let isBackendAvailable: boolean | null = null;
let lastCheckTime = 0;

export async function checkBackend(): Promise<boolean> {
  const now = Date.now();
  // Cache positive check for 30s
  if (isBackendAvailable === true && (now - lastCheckTime < 30000)) {
    return true;
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const healthUrl = `${API_BASE.replace('/api/v1', '')}/health`;
    const res = await fetch(healthUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    isBackendAvailable = res.ok;
    lastCheckTime = now;
  } catch {
    isBackendAvailable = false;
    lastCheckTime = now;
  }
  return isBackendAvailable;
}

export function getAuthToken(): string | null {
  const directToken = localStorage.getItem('sb_auth_token');
  if (directToken) return directToken;
  const user = localStorage.getItem('sb_current_user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      return parsed.token || null;
    } catch {
      return null;
    }
  }
  return null;
}

export function setAuthSession(token: string, user: User) {
  localStorage.setItem('sb_auth_token', token);
  localStorage.setItem('sb_current_user', JSON.stringify({ ...user, token }));
}

export function clearAuthSession() {
  localStorage.removeItem('sb_auth_token');
  localStorage.removeItem('sb_current_user');
}

export function isTokenExpired(token?: string | null): boolean {
  const t = token || getAuthToken();
  if (!t) return true;
  try {
    const parts = t.split('.');
    if (parts.length < 2) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return false;
  }
}

export const apiClient = {
  // Check backend connectivity status
  isOnline: async () => await checkBackend(),

  // ── AUTHENTICATION & IDENTITY (DATABASE PERSISTED) ──
  async register(data: {
    email: string;
    password: string;
    fullName: string;
    role?: string;
    department?: string;
    year?: string;
    university?: string;
  }): Promise<{ success: boolean; data?: { token: string; user: any }; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          role: (data.role || 'MENTEE').toUpperCase(),
          department: data.department || 'General Engineering',
          currentYear: data.year || '1st Year',
          university: data.university || 'NIT Nagaland',
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, message: json.message || 'Registration failed' };
      }
      return { success: true, data: json.data, message: json.message };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error connecting to registration server' };
    }
  },

  async sendRegistrationOtp(data: {
    email: string;
    fullName?: string;
    password?: string;
    role?: string;
    department?: string;
    year?: string;
    university?: string;
  }): Promise<{ success: boolean; data?: { email: string; expiresInSeconds: number; devCode?: string }; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/send-registration-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          fullName: data.fullName,
          password: data.password,
          role: data.role ? (data.role).toUpperCase() : 'MENTEE',
          department: data.department,
          currentYear: data.year,
          university: data.university || 'NIT Nagaland',
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, message: json.message || 'Failed to dispatch verification code' };
      }
      return { success: true, data: json.data, message: json.message };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error while requesting verification code' };
    }
  },

  async verifyRegistrationOtp(data: {
    email: string;
    code: string;
    registrationData?: {
      fullName?: string;
      password?: string;
      role?: string;
      department?: string;
      year?: string;
      university?: string;
    };
  }): Promise<{ success: boolean; data?: { token: string; user: any }; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-registration-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, message: json.message || 'Invalid verification code' };
      }
      return { success: true, data: json.data, message: json.message };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error verifying security code' };
    }
  },

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; data?: { token: string; user: any }; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, message: json.message || 'Invalid email or password' };
      }
      return { success: true, data: json.data, message: json.message };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error connecting to login server' };
    }
  },

  async loginWithFirebase(payload: {
    idToken: string;
    role?: string;
    department?: string;
    currentYear?: string;
    university?: string;
  }): Promise<{ success: boolean; data?: { token: string; user: any; firebaseProvider?: string }; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/firebase-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, message: json.message || 'Firebase authentication failed' };
      }
      return { success: true, data: json.data, message: json.message };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error during Firebase authentication' };
    }
  },

  async authenticateWithGoogle(payload: {
    email: string;
    fullName?: string;
    avatarUrl?: string;
  }): Promise<{ success: boolean; data?: { token: string; user: any }; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/google-authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, message: json.message || 'Google authentication failed' };
      }
      return { success: true, data: json.data, message: json.message };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error during Google authentication' };
    }
  },

  async authenticateWithGitHub(payload: {
    username: string;
    email?: string;
  }): Promise<{ success: boolean; data?: { token: string; user: any; githubProfile?: any }; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/github-authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, message: json.message || 'GitHub authentication failed' };
      }
      return { success: true, data: json.data, message: json.message };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error during GitHub authentication' };
    }
  },

  async previewGitHubUser(username: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const clean = username.trim().replace(/^@/, '');
      const res = await fetch(`${API_BASE}/auth/github-preview/${encodeURIComponent(clean)}`);
      const json = await res.json();
      if (!res.ok) {
        return { success: false, message: json.message || 'GitHub user not found' };
      }
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error while checking GitHub user' };
    }
  },

  async getMe(): Promise<any | null> {
    const token = getAuthToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Return null on failure
    }
    return null;
  },

  getApiBase(): string {
    return API_BASE;
  },

  async getAuthProviders(): Promise<{
    googleConfigured: boolean;
    githubConfigured: boolean;
    linkedinConfigured: boolean;
  }> {
    try {
      const res = await fetch(`${API_BASE}/auth/providers`);
      if (res.ok) {
        const json = await res.json();
        return {
          googleConfigured: Boolean(json.data?.googleConfigured),
          githubConfigured: Boolean(json.data?.githubConfigured),
          linkedinConfigured: Boolean(json.data?.linkedinConfigured),
        };
      }
    } catch {
      // Fall through
    }
    return {
      googleConfigured: false,
      githubConfigured: false,
      linkedinConfigured: false,
    };
  },

  async unlinkAccount(provider: string): Promise<{ success: boolean; message?: string }> {
    const token = getAuthToken();
    if (!token) return { success: false, message: 'Authentication required' };
    try {
      const res = await fetch(`${API_BASE}/auth/linked-accounts/${provider}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, message: json.message || 'Failed to unlink account' };
      }
      return { success: true, message: json.message };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error while unlinking account' };
    }
  },

  // ── MESSAGING & REAL-TIME CONVERSATIONS (DATABASE PERSISTED) ──
  async getConversations(): Promise<Conversation[]> {
    const token = getAuthToken();
    if (!token) return [];

    try {
      const res = await fetch(`${API_BASE}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        const backendConvs = json.data || [];
        return backendConvs.map((conv: any) => {
          // If backend returned otherUser, persist otherUser into LocalData cache so helper lookups work
          if (conv.otherUser && conv.otherUser.id) {
            const existing = LocalData.getUserById(conv.otherUser.id);
            if (!existing) {
              LocalData.addUser({
                id: conv.otherUser.id,
                email: conv.otherUser.email,
                fullName: conv.otherUser.profile?.fullName || (typeof conv.otherUser.email === 'string' && conv.otherUser.email.includes('@') ? conv.otherUser.email.split('@')[0] : 'Campus Peer'),
                avatar: conv.otherUser.profile?.avatarUrl || '',
                role: (conv.otherUser.role || 'mentee').toLowerCase(),
                department: conv.otherUser.profile?.department || 'Engineering',
                year: conv.otherUser.profile?.currentYear || '2nd Year',
                university: conv.otherUser.profile?.university || 'NIT Nagaland',
                bio: conv.otherUser.profile?.bio || '',
                headline: conv.otherUser.profile?.headline || '',
                isVerified: true,
                isSuspended: false,
                learningPreferences: [],
                languages: ['English'],
                onlineStatus: conv.otherUser.profile?.onlineStatus || 'available',
              });
            }
          }

          return {
            id: conv.id,
            participantIds: conv.participantIds || [conv.otherUser?.id].filter(Boolean),
            otherUser: conv.otherUser,
            lastMessage: typeof conv.lastMessage === 'string' ? conv.lastMessage : (conv.lastMessage?.content || ''),
            lastMessageAt: conv.lastMessage?.createdAt || conv.updatedAt || new Date().toISOString(),
            createdAt: conv.createdAt || conv.updatedAt || new Date().toISOString(),
            unreadCount: {},
          };
        });
      }
    } catch (e) {
      console.warn('Backend conversations fetch error:', e);
    }
    return [];
  },

  async startConversation(recipientId: string): Promise<Conversation | null> {
    const token = getAuthToken();
    const currentUser = JSON.parse(localStorage.getItem('sb_current_user') || '{}');

    if (token) {
      try {
        const res = await fetch(`${API_BASE}/messages/conversations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipientId }),
        });
        if (res.ok) {
          const json = await res.json();
          const conv = json.data;
          const mapped: Conversation = {
            id: conv.id,
            participantIds: conv.participantIds || [recipientId],
            otherUser: conv.otherUser,
            lastMessage: conv.lastMessage?.content || '',
            lastMessageAt: conv.lastMessage?.createdAt || conv.updatedAt || new Date().toISOString(),
            createdAt: conv.createdAt || conv.updatedAt || new Date().toISOString(),
            unreadCount: {},
          };
          return mapped;
        }
      } catch (e) {
        console.warn('Backend start conversation error:', e);
      }
    }

    // Local fallback for offline / local mode
    if (currentUser?.id) {
      const local = LocalData.getOrCreateConversation(currentUser.id, recipientId);
      return local;
    }
    return null;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const token = getAuthToken();
    if (token && conversationId && !conversationId.startsWith('conv-')) {
      try {
        const res = await fetch(`${API_BASE}/messages/conversations/${conversationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          const backendMsgs = json.data || [];
          return backendMsgs.map((m: any) => ({
            id: m.id,
            conversationId: m.conversationId || conversationId,
            senderId: m.senderId,
            content: m.content,
            timestamp: m.createdAt || m.timestamp || new Date().toISOString(),
            isRead: true,
          }));
        }
      } catch (e) {
        console.warn('Backend messages fetch error:', e);
      }
    }

    // Local fallback
    if (conversationId) {
      return LocalData.getMessagesByConversation(conversationId);
    }
    return [];
  },

  async sendMessage(conversationId: string, content: string): Promise<Message | null> {
    const currentUser = JSON.parse(localStorage.getItem('sb_current_user') || '{}');
    const token = getAuthToken();

    if (token && conversationId && !conversationId.startsWith('conv-')) {
      try {
        const res = await fetch(`${API_BASE}/messages/conversations/${conversationId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: content.trim() }),
        });
        if (res.ok) {
          const json = await res.json();
          const m = json.data;
          return {
            id: m.id,
            conversationId: m.conversationId || conversationId,
            senderId: m.senderId || currentUser.id,
            content: m.content,
            timestamp: m.createdAt || new Date().toISOString(),
            isRead: true,
          };
        }
      } catch (e) {
        console.warn('Backend send message error:', e);
      }
    }

    // Local fallback
    if (conversationId && currentUser?.id) {
      const localMsg = LocalData.addMessage({
        conversationId,
        senderId: currentUser.id,
        content: content.trim(),
      });
      return localMsg;
    }
    return null;
  },

  // ── FEED & POSTS ──
  async getPosts(): Promise<Post[]> {
    const online = await checkBackend();
    if (online) {
      try {
        const token = getAuthToken();
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}/posts/feed`, { headers });
        if (res.ok) {
          const json = await res.json();
          return json.data.posts;
        }
      } catch {
        // Fallback to local
      }
    }
    return LocalData.getPosts();
  },

  async createPost(postData: { content: string; postType: any; tags: string[]; mediaUrls?: string[]; communityId?: string }): Promise<Post> {
    const currentUser = JSON.parse(localStorage.getItem('sb_current_user') || '{}');
    const online = await checkBackend();
    if (online) {
      try {
        const token = getAuthToken();
        const res = await fetch(`${API_BASE}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(postData),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback
      }
    }

    return LocalData.addPost({
      authorId: currentUser.id || 'mentee-1',
      authorName: currentUser.fullName || 'Student',
      authorHeadline: currentUser.headline || `${currentUser.department} Student`,
      authorDepartment: currentUser.department || 'Computer Science',
      authorRole: currentUser.role || 'mentee',
      content: postData.content,
      postType: postData.postType,
      tags: postData.tags,
      communityId: postData.communityId,
    });
  },

  async toggleLikePost(postId: string): Promise<Post | undefined> {
    const online = await checkBackend();
    if (online) {
      try {
        const token = getAuthToken();
        await fetch(`${API_BASE}/posts/${postId}/react`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ type: 'LIKE' }),
        });
      } catch {
        // Fallback
      }
    }
    return LocalData.toggleLikePost(postId);
  },

  async addComment(postId: string, content: string): Promise<any> {
    const currentUser = JSON.parse(localStorage.getItem('sb_current_user') || '{}');
    const online = await checkBackend();
    if (online) {
      try {
        const token = getAuthToken();
        const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ content }),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback
      }
    }
    return LocalData.addCommentToPost(postId, content, currentUser);
  },

  async toggleSave(postId: string): Promise<boolean> {
    return LocalData.toggleSavePost(postId);
  },

  // ── COMMUNITIES ──
  async getCommunities(): Promise<CommunityItem[]> {
    const online = await checkBackend();
    if (online) {
      try {
        const res = await fetch(`${API_BASE}/communities`);
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch {
        // Fallback
      }
    }
    return LocalData.getCommunities();
  },

  async toggleCommunity(communityId: string): Promise<boolean> {
    const online = await checkBackend();
    if (online) {
      try {
        const token = getAuthToken();
        await fetch(`${API_BASE}/communities/${communityId}/join-toggle`, {
          method: 'POST',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
      } catch {
        // Fallback
      }
    }
    return LocalData.toggleCommunityMembership(communityId);
  },

  // ── CONNECTIONS & NETWORK ──
  async getNetworkSummary(): Promise<any> {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/network/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch (err) {
        console.warn('Network summary API error:', err);
      }
    }
    return {
      connectionsCount: 0,
      connections: [],
      pendingReceived: [],
      pendingSentCount: 0,
      followingCount: 0,
      followersCount: 0,
    };
  },

  async getPeerSuggestions(params?: { university?: string; excludeUniversity?: string; search?: string; limit?: number }): Promise<any[]> {
    const token = getAuthToken();
    try {
      const url = new URL(`${API_BASE}/network/suggestions`);
      if (params?.university) url.searchParams.set('university', params.university);
      if (params?.excludeUniversity) url.searchParams.set('excludeUniversity', params.excludeUniversity);
      if (params?.search) url.searchParams.set('search', params.search);
      if (params?.limit) url.searchParams.set('limit', params.limit.toString());

      const res = await fetch(url.toString(), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (err) {
      console.warn('Failed to fetch peer suggestions from server:', err);
    }
    return [];
  },

  async getConnections(): Promise<Connection[]> {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/network/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.connections) {
            const current = JSON.parse(localStorage.getItem('sb_current_user') || '{}');
            return json.data.connections.map((c: any) => ({
              id: c.connectionId,
              senderId: c.user?.id,
              receiverId: current?.id,
              status: 'accepted',
              createdAt: c.connectedSince,
            }));
          }
        }
      } catch (err) {
        console.warn('Network connections API error, falling back to local store:', err);
      }
    }
    return LocalData.getConnections();
  },

  async sendConnectionRequest(senderId: string, receiverId: string): Promise<any> {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/network/request`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ targetUserId: receiverId }),
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch (err) {
        console.warn('Send connection request API error:', err);
      }
    }
    return LocalData.sendConnectionRequest(senderId, receiverId);
  },

  async respondConnectionRequest(requestId: string, status: 'ACCEPTED' | 'REJECTED'): Promise<void> {
    const token = getAuthToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/network/request/${requestId}/respond`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action: status }),
        });
      } catch (err) {
        console.warn('Respond connection request API error:', err);
      }
    }
    LocalData.respondConnectionRequest(requestId, status);
  },

  async removeConnection(connectionId: string): Promise<void> {
    const token = getAuthToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/network/request/${connectionId}/respond`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action: 'WITHDRAW' }),
        });
      } catch (err) {
        console.warn('Remove connection API error:', err);
      }
    }
    LocalData.removeConnection(connectionId);
  },

  // ── SKILLS & ENDORSEMENTS ──
  async getSkills(): Promise<SkillItem[]> {
    return LocalData.getSkills();
  },

  async endorseSkill(skillId: string, user: User): Promise<SkillItem | undefined> {
    return LocalData.endorseSkill(skillId, user);
  },

  // ── USER & PROFILE PERSISTENCE (DATABASE PERSISTED) ──
  async updateProfile(updates: Partial<User>): Promise<User | undefined> {
    const currentUser = JSON.parse(localStorage.getItem('sb_current_user') || '{}');
    if (!currentUser.id) return undefined;

    const updated = LocalData.updateUser(currentUser.id, updates);
    if (updated) {
      localStorage.setItem('sb_current_user', JSON.stringify({ ...updated, token: getAuthToken() }));
    }

    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/profiles/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: updates.fullName,
            headline: updates.headline,
            bio: updates.bio,
            department: updates.department,
            currentYear: updates.year,
            university: updates.university,
            portfolioUrl: updates.portfolioUrl,
            githubUrl: updates.githubUrl,
            linkedinUrl: updates.linkedinUrl,
            languages: updates.languages,
            avatarUrl: updates.avatar,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && updated) {
            updated.fullName = json.data.fullName || updated.fullName;
            updated.headline = json.data.headline || updated.headline;
            updated.bio = json.data.bio || updated.bio;
            updated.avatar = json.data.avatarUrl || updated.avatar;
            localStorage.setItem('sb_current_user', JSON.stringify({ ...updated, token }));
          }
        }
      } catch (err) {
        console.warn('Backend database profile sync deferred:', err);
      }
    }
    return updated;
  },

  // ── IMAGE UPLOADS ──
  async uploadAvatar(base64DataUri: string): Promise<string> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/uploads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ image: base64DataUri, folder: 'avatars' }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data.url;
      }
    } catch (err) {
      console.warn('Avatar upload to server failed, returning base64 URI:', err);
    }
    return base64DataUri;
  },

  // ── ADMIN CONTROL & REAL-TIME PLATFORM TELEMETRY ──
  async getAdminDashboard(): Promise<any> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Admin dashboard fetch failed:', err);
    }
    return null;
  },

  async getAdminUsers(params?: { search?: string; role?: string; status?: string; page?: number; limit?: number }): Promise<any> {
    const token = getAuthToken();
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.role) query.append('role', params.role);
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    try {
      const res = await fetch(`${API_BASE}/admin/users?${query.toString()}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Admin users fetch failed:', err);
    }
    return null;
  },

  async getAdminUserDetails(userId: string): Promise<any> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Admin user details fetch failed:', err);
    }
    return null;
  },

  async updateAdminUserStatus(userId: string, update: { isSuspended?: boolean; isVerified?: boolean; role?: string }): Promise<boolean> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(update),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async toggleAdminUserSuspension(userId: string, suspend: boolean): Promise<boolean> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/suspend`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ suspend }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getAdminConversations(params?: { search?: string; page?: number; limit?: number }): Promise<any> {
    const token = getAuthToken();
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    try {
      const res = await fetch(`${API_BASE}/admin/conversations?${query.toString()}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Admin conversations fetch failed:', err);
    }
    return null;
  },

  async inspectAdminConversation(conversationId: string, reason = 'Safety and Moderation Review'): Promise<any> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/admin/conversations/${conversationId}?reason=${encodeURIComponent(reason)}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Admin conversation inspection failed:', err);
    }
    return null;
  },

  async getAdminActivity(): Promise<any[]> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/admin/activity`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (err) {
      console.warn('Admin activity fetch failed:', err);
    }
    return [];
  },

  async getAdminAnalytics(): Promise<any> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/admin/analytics`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Admin analytics fetch failed:', err);
    }
    return null;
  },

  async getAdminAuditLogs(params?: { page?: number; limit?: number }): Promise<any> {
    const token = getAuthToken();
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    try {
      const res = await fetch(`${API_BASE}/admin/audit-logs?${query.toString()}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Admin audit logs fetch failed:', err);
    }
    return null;
  },

  async getAdminReports(): Promise<any[]> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/admin/reports`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (err) {
      console.warn('Admin reports fetch failed:', err);
    }
    return [];
  },

  async resolveAdminReport(reportId: string, status = 'RESOLVED', note?: string): Promise<boolean> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/admin/reports/${reportId}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status, note }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // ── MENTORSHIP & SESSIONS JOURNEY ──
  async bookSession(data: {
    mentorId: string;
    topic: string;
    description?: string;
    sessionDate: string;
    startTime: string;
    duration?: number;
    sessionType?: 'ONLINE' | 'IN_PERSON';
    location?: string;
    meetingLink?: string;
  }): Promise<any> {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/mentorship/sessions/book`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (res.ok) {
          return json.data;
        }
        throw new Error(json.message || 'Failed to book session');
      } catch (err: any) {
        if (err.message && !err.message.includes('fetch')) {
          throw err;
        }
        console.warn('Backend book session failed, falling back to local storage:', err);
      }
    }
    const currentUser = JSON.parse(localStorage.getItem('sb_current_user') || '{}');
    if (!currentUser.id) throw new Error('You must be logged in to book a session');
    return LocalData.addSession({
      mentorId: data.mentorId,
      menteeId: currentUser.id,
      date: data.sessionDate,
      startTime: data.startTime,
      duration: data.duration || 60,
      topic: data.topic,
      description: data.description || '',
      notes: data.description || '',
      sessionType: (data.sessionType?.toLowerCase() as any) || 'online',
      status: 'pending',
    });
  },

  async getUserSessions(params?: { status?: string; role?: 'mentee' | 'mentor' }): Promise<any[]> {
    const token = getAuthToken();
    if (token) {
      try {
        const query = new URLSearchParams();
        if (params?.status) query.append('status', params.status);
        if (params?.role) query.append('role', params.role);
        const res = await fetch(`${API_BASE}/mentorship/sessions?${query.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          return json.data || [];
        }
      } catch (err) {
        console.warn('Backend get sessions failed, falling back to local:', err);
      }
    }
    const currentUser = JSON.parse(localStorage.getItem('sb_current_user') || '{}');
    if (currentUser.id) {
      let sessions = LocalData.getSessionsByUser(currentUser.id);
      if (params?.status) {
        sessions = sessions.filter(s => s.status.toLowerCase() === params.status?.toLowerCase());
      }
      return sessions;
    }
    return [];
  },

  async getSessionById(sessionId: string): Promise<any | null> {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/mentorship/sessions/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      } catch (err) {
        console.warn('Backend get session by id failed, falling back:', err);
      }
    }
    return LocalData.getSessionById(sessionId) || null;
  },

  async updateSessionStatus(
    sessionId: string,
    status: 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED',
    cancellationReason?: string
  ): Promise<any> {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/mentorship/sessions/${sessionId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, cancellationReason }),
        });
        const json = await res.json();
        if (res.ok) return json.data;
        throw new Error(json.message || 'Status update failed');
      } catch (err: any) {
        if (err.message && !err.message.includes('fetch')) throw err;
        console.warn('Backend update status failed, falling back:', err);
      }
    }
    return LocalData.updateSession(sessionId, {
      status: status.toLowerCase() as any,
      cancellationReason,
    });
  },

  async rescheduleSession(sessionId: string, sessionDate: string, startTime: string): Promise<any> {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/mentorship/sessions/${sessionId}/reschedule`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionDate, startTime }),
        });
        const json = await res.json();
        if (res.ok) return json.data;
        throw new Error(json.message || 'Reschedule failed');
      } catch (err: any) {
        if (err.message && !err.message.includes('fetch')) throw err;
        console.warn('Backend reschedule failed, falling back:', err);
      }
    }
    return LocalData.updateSession(sessionId, {
      date: sessionDate,
      startTime,
      status: 'pending',
    });
  },

  async getMentorAvailability(mentorId: string): Promise<any> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/mentorship/mentors/${mentorId}/availability`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Backend mentor availability failed:', err);
    }
    return {
      mentorId,
      availability: LocalData.getAvailabilityByMentor(mentorId),
      bookedSlots: [],
    };
  },

  getSessionIcsUrl(sessionId: string): string {
    return `${API_BASE}/mentorship/sessions/${sessionId}/ics`;
  },

  async submitReview(sessionId: string, rating: number, comment?: string): Promise<any> {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/mentorship/sessions/${sessionId}/review`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment }),
        });
        const json = await res.json();
        if (res.ok) return json.data;
        throw new Error(json.message || 'Failed to submit review');
      } catch (err: any) {
        if (err.message && !err.message.includes('fetch')) throw err;
      }
    }
    const currentUser = JSON.parse(localStorage.getItem('sb_current_user') || '{}');
    const sess = LocalData.getSessionById(sessionId);
    if (sess) {
      return LocalData.addReview({
        sessionId,
        menteeId: currentUser.id || 'reviewer',
        mentorId: sess.mentorId,
        overallRating: rating,
        teachingQuality: rating,
        communication: rating,
        subjectKnowledge: rating,
        review: comment || '',
      });
    }
  },

  // ── TRUST, SAFETY & REPORTING ──
  async fileReport(data: {
    reportedUserId: string;
    reason: string;
    details?: string;
    conversationId?: string;
  }): Promise<boolean> {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/reports`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        return res.ok;
      } catch (err) {
        console.warn('Backend file report failed:', err);
      }
    }
    const currentUser = JSON.parse(localStorage.getItem('sb_current_user') || '{}');
    LocalData.addReport({
      reporterId: currentUser.id || 'anonymous',
      reportedUserId: data.reportedUserId,
      reason: data.reason,
      description: data.details || 'User report filed',
    });
    return true;
  },
};
