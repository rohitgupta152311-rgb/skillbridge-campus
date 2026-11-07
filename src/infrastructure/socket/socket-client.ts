import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '../api/api-client';

const API_BASE = import.meta.env.VITE_API_URL || 'https://skillbridge-backend-15a7.onrender.com/api/v1';
const SOCKET_URL = API_BASE.replace('/api/v1', '');

class SocketClientManager {
  private socket: Socket | null = null;
  private currentConversationId: string | null = null;
  private messageListeners: Set<(message: any) => void> = new Set();
  private typingListeners: Set<(data: { conversationId: string; userId: string; isTyping: boolean }) => void> = new Set();
  private statusListeners: Set<(data: { userId: string; status: string }) => void> = new Set();
  private conversationUpdateListeners: Set<(data: { conversationId: string; lastMessage: any }) => void> = new Set();

  connect(): Socket | null {
    const token = getAuthToken();
    if (!token) {
      if (this.socket) {
        this.disconnect();
      }
      return null;
    }

    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      // Re-join active room if reconnection happened
      if (this.currentConversationId) {
        this.socket?.emit('conversation:join', this.currentConversationId);
      }
    });

    this.socket.on('message:received', (message: any) => {
      this.messageListeners.forEach((listener) => {
        try {
          listener(message);
        } catch (e) {
          console.error('Error in message listener', e);
        }
      });
    });

    this.socket.on('typing:status', (data: any) => {
      this.typingListeners.forEach((listener) => {
        try {
          listener(data);
        } catch (e) {
          console.error('Error in typing listener', e);
        }
      });
    });

    this.socket.on('user:status_change', (data: any) => {
      this.statusListeners.forEach((listener) => {
        try {
          listener(data);
        } catch (e) {
          console.error('Error in status listener', e);
        }
      });
    });

    this.socket.on('conversation:updated', (data: any) => {
      this.conversationUpdateListeners.forEach((listener) => {
        try {
          listener(data);
        } catch (e) {
          console.error('Error in conversation update listener', e);
        }
      });
    });

    return this.socket;
  }

  joinConversation(conversationId: string) {
    this.currentConversationId = conversationId;
    if (!this.socket || !this.socket.connected) {
      this.connect();
    }
    this.socket?.emit('conversation:join', conversationId);
  }

  leaveConversation(conversationId: string) {
    if (this.currentConversationId === conversationId) {
      this.currentConversationId = null;
    }
    this.socket?.emit('conversation:leave', conversationId);
  }

  sendMessage(conversationId: string, content: string) {
    if (!content.trim()) return;
    if (!this.socket || !this.socket.connected) {
      this.connect();
    }
    this.socket?.emit('message:send', { conversationId, content: content.trim() });
  }

  sendTyping(conversationId: string, isTyping: boolean) {
    if (!this.socket || !this.socket.connected) return;
    if (isTyping) {
      this.socket.emit('typing:start', { conversationId });
    } else {
      this.socket.emit('typing:stop', { conversationId });
    }
  }

  onMessageReceived(callback: (message: any) => void): () => void {
    this.messageListeners.add(callback);
    return () => {
      this.messageListeners.delete(callback);
    };
  }

  onTypingStatus(callback: (data: { conversationId: string; userId: string; isTyping: boolean }) => void): () => void {
    this.typingListeners.add(callback);
    return () => {
      this.typingListeners.delete(callback);
    };
  }

  onUserStatusChange(callback: (data: { userId: string; status: string }) => void): () => void {
    this.statusListeners.add(callback);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  onConversationUpdated(callback: (data: { conversationId: string; lastMessage: any }) => void): () => void {
    this.conversationUpdateListeners.add(callback);
    return () => {
      this.conversationUpdateListeners.delete(callback);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentConversationId = null;
  }

  isConnected(): boolean {
    return Boolean(this.socket?.connected);
  }
}

export const socketClient = new SocketClientManager();
