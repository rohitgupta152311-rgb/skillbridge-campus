import { io, Socket } from 'socket.io-client';
import { Storage } from './storage';
import { API_URL } from './api';

let socket: Socket | null = null;

export const SocketService = {
  async connect(): Promise<Socket> {
    if (socket && socket.connected) {
      return socket;
    }

    const token = await Storage.getItem('sb_auth_token');
    const socketHost = API_URL.replace('/api/v1', '');

    socket = io(socketHost, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Mobile Socket.IO connected:', socket?.id);
    });

    socket.on('connect_error', (err) => {
      console.warn('Mobile Socket.IO connection warning:', err.message);
    });

    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket(): Socket | null {
    return socket;
  },
};
