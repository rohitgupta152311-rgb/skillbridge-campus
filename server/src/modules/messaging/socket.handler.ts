import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../../configuration/env.js';
import { prisma } from '../../database/prisma.js';
import { AuthenticatedUser } from '../../middleware/authentication.js';

interface SocketWithUser extends Socket {
  user?: AuthenticatedUser;
}

export function setupSocketIO(io: SocketIOServer) {
  // Authentication middleware
  io.use((socket: SocketWithUser, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication required for socket connection.'));
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
      socket.user = decoded;
      return next();
    } catch (err) {
      return next(new Error('Invalid token.'));
    }
  });

  io.on('connection', async (socket: SocketWithUser) => {
    const userId = socket.user?.id;
    if (!userId) return;

    // Join personal user room for direct notifications
    socket.join(`user:${userId}`);

    // Update user online status
    try {
      await prisma.profile.updateMany({
        where: { userId },
        data: { onlineStatus: 'available' },
      });
      io.emit('user:status_change', { userId, status: 'available' });
    } catch (e) {
      // Ignore
    }

    // Join conversation room
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    // Leave conversation room
    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Typing indicators
    socket.on('typing:start', ({ conversationId }: { conversationId: string }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:status', {
        conversationId,
        userId,
        isTyping: true,
      });
    });

    socket.on('typing:stop', ({ conversationId }: { conversationId: string }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:status', {
        conversationId,
        userId,
        isTyping: false,
      });
    });

    // Realtime message dispatch
    socket.on('message:send', async ({ conversationId, content }: { conversationId: string; content: string }) => {
      if (!content || !content.trim()) return;

      try {
        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId: userId,
            content: content.trim(),
          },
          include: {
            sender: { include: { profile: true } },
          },
        });

        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        });

        // Broadcast to everyone in conversation room
        io.to(`conversation:${conversationId}`).emit('message:received', message);
      } catch (err) {
        socket.emit('error', { message: 'Failed to deliver message.' });
      }
    });

    socket.on('disconnect', async () => {
      try {
        await prisma.profile.updateMany({
          where: { userId },
          data: { onlineStatus: 'offline' },
        });
        io.emit('user:status_change', { userId, status: 'offline' });
      } catch (e) {
        // Ignore
      }
    });
  });
}
