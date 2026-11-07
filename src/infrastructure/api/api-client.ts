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

  // ── MESSAGING & REAL-TIME CONVERSATIONS (DATABASE PERSISTED) ──
  async getConversations(): Promise<Conversation[]> {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/messages/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          const backendConvs = json.data || [];
          // Map backend conversations to frontend Conversation type
          return backendConvs.map((conv: any) => {
            // If backend returned otherUser, persist otherUser into LocalData so UI avatar/status works
            if (conv.otherUser && conv.otherUser.id) {
              const existing = LocalData.getUserById(conv.otherUser.id);
              if (!existing) {
                LocalData.addUser({
                  id: conv.otherUser.id,
                  email: conv.otherUser.email,
                  fullName: conv.otherUser.profile?.fullName || (conv.otherUser.email ? conv.otherUser.email.split('@')[0] : 'Campus Peer'),
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
                  onlineStatus: 'available',
                });
              }
            }

            return {
              id: conv.id,
              participantIds: conv.participantIds || [conv.otherUser?.id].filter(Boolean),
              lastMessage: typeof conv.lastMessage === 'string' ? conv.lastMessage : (conv.lastMessage?.content || ''),
              lastMessageAt: conv.lastMessage?.createdAt || conv.updatedAt || new Date().toISOString(),
              createdAt: conv.createdAt || conv.updatedAt || new Date().toISOString(),
              unreadCount: {},
            };
          });
        }
      } catch (e) {
        console.warn('Backend conversations fetch error, falling back to local:', e);
      }
    }
    const currentUser = JSON.parse(localStorage.getItem('sb_current_user') || '{}');
    return currentUser.id ? LocalData.getConversationsByUser(currentUser.id) : [];
  },

  async startConversation(recipientId: string): Promise<Conversation | null> {
    const token = getAuthToken();
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
            lastMessage: conv.lastMessage?.content || '',
            lastMessageAt: conv.lastMessage?.createdAt || conv.updatedAt || new Date().toISOString(),
            createdAt: conv.createdAt || conv.updatedAt || new Date().toISOString(),
            unreadCount: {},
          };
          return mapped;
        }
      } catch (e) {
        console.warn('Backend start conversation error, falling back to local:', e);
      }
    }
    const currentUser = JSON.parse(localStorage.getItem('sb_current_user') || '{}');
    if (currentUser.id) {
      return LocalData.getOrCreateConversation(currentUser.id, recipientId);
    }
    return null;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const token = getAuthToken();
    if (token) {
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
        console.warn('Backend messages fetch error, falling back to local:', e);
      }
    }
    return LocalData.getMessagesByConversation(conversationId);
  },

  async sendMessage(conversationId: string, content: string): Promise<Message | null> {
    const currentUser = JSON.parse(localStorage.getItem('sb_current_user') || '{}');
    const token = getAuthToken();
    if (token) {
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
          const msgObj: Message = {
            id: m.id,
            conversationId: m.conversationId || conversationId,
            senderId: m.senderId || currentUser.id,
            content: m.content,
            timestamp: m.createdAt || new Date().toISOString(),
            isRead: true,
          };
          // Also record locally for instant smooth offline-compatible UI
          LocalData.addMessage({
            conversationId,
            senderId: currentUser.id,
            content: content.trim(),
          });
          return msgObj;
        }
      } catch (e) {
        console.warn('Backend send message error, falling back to local:', e);
      }
    }

    if (currentUser.id) {
      return LocalData.addMessage({
        conversationId,
        senderId: currentUser.id,
        content: content.trim(),
      });
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
  async getConnections(): Promise<Connection[]> {
    return LocalData.getConnections();
  },

  async sendConnectionRequest(senderId: string, receiverId: string): Promise<Connection> {
    return LocalData.sendConnectionRequest(senderId, receiverId);
  },

  async respondConnectionRequest(connectionId: string, status: 'ACCEPTED' | 'REJECTED'): Promise<void> {
    LocalData.respondConnectionRequest(connectionId, status);
  },

  async removeConnection(connectionId: string): Promise<void> {
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
};
