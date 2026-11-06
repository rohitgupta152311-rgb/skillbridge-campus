import { Post, CommunityItem, SkillItem, Connection, User, MentorProfile } from '../../foundation/types';
import * as LocalData from '../local-storage/data-service';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

let isBackendAvailable: boolean | null = null;

async function checkBackend(): Promise<boolean> {
  if (isBackendAvailable !== null) return isBackendAvailable;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE.replace('/api/v1', '')}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    isBackendAvailable = res.ok;
  } catch (err) {
    isBackendAvailable = false;
  }
  return isBackendAvailable;
}

function getAuthToken(): string | null {
  const user = localStorage.getItem('sb_current_user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      return parsed.token || 'demo-token';
    } catch {
      return null;
    }
  }
  return null;
}

export const apiClient = {
  // Check backend connectivity status
  isOnline: async () => await checkBackend(),

  // Feed & Posts
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
      } catch (e) {
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
      } catch (e) {
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

  // Communities
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

  // Connections & Network
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

  // Skills & Endorsements
  async getSkills(): Promise<SkillItem[]> {
    return LocalData.getSkills();
  },

  async endorseSkill(skillId: string, user: User): Promise<SkillItem | undefined> {
    return LocalData.endorseSkill(skillId, user);
  },
  // User & Profile Persistence
  async updateProfile(updates: Partial<User>): Promise<User | undefined> {
    const currentUser = JSON.parse(localStorage.getItem('sb_current_user') || '{}');
    if (!currentUser.id) return undefined;

    const updated = LocalData.updateUser(currentUser.id, updates);
    if (updated) {
      localStorage.setItem('sb_current_user', JSON.stringify(updated));
    }

    const online = await checkBackend();
    if (online) {
      try {
        const token = getAuthToken();
        await fetch(`${API_BASE}/profiles/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
      } catch (err) {
        console.warn('Backend database sync deferred; saved to persistent storage:', err);
      }
    }
    return updated;
  },
};
