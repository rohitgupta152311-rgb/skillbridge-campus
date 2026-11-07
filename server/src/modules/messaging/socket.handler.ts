import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../../configuration/env.js';
import { prisma } from '../../database/prisma.js';
import { AuthenticatedUser } from '../../middleware/authentication.js';
import { FirebaseService } from '../../integrations/firebase/firebase.service.js';

interface SocketWithUser extends Socket {
  user?: AuthenticatedUser;
}

export function setupSocketIO(io: SocketIOServer) {
  // Authentication middleware with dual JWT and Firebase support
  io.use(async (socket: SocketWithUser, next) => {
    const rawToken = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!rawToken) {
      return next(new Error('Authentication required for socket connection.'));
    }

    // 1. Try standard application JWT verification
    try {
      const decoded = jwt.verify(rawToken, env.JWT_SECRET) as AuthenticatedUser;
      socket.user = decoded;
      return next();
    } catch {
      // 2. Try Firebase ID Token verification
      try {
        const firebaseUser = await FirebaseService.verifyFirebaseIdToken(rawToken);
        const dbUser = await prisma.user.findUnique({
          where: { email: firebaseUser.email },
        });

        if (dbUser) {
          socket.user = {
            id: dbUser.id,
            email: dbUser.email,
            role: dbUser.role,
          };
          return next();
        }
      } catch {
        // Fall through to error
      }
    }

    return next(new Error('Invalid or expired socket authentication token.'));
  });

  io.on('connection', async (socket: SocketWithUser) => {
    const userId = socket.user?.id;
    if (!userId) {
      socket.disconnect(true);
      return;
    }

    // Join personal user room for targeted notifications
    socket.join(`user:${userId}`);

    // Update user online status
    try {
      await prisma.profile.updateMany({
        where: { userId },
        data: { onlineStatus: 'available' },
      });
      io.emit('user:status_change', { userId, status: 'available' });
    } catch {
      // Ignore
    }

    // Join conversation room (strictly authorized: only participants can join)
    socket.on('conversation:join', async (conversationId: string) => {
      if (!conversationId || typeof conversationId !== 'string') return;
      try {
        const participant = await prisma.conversationParticipant.findUnique({
          where: {
            conversationId_userId: {
              conversationId,
              userId,
            },
          },
        });

        if (!participant) {
          socket.emit('error', { message: 'Unauthorized: You are not a participant in this conversation.' });
          return;
        }

        socket.join(`conversation:${conversationId}`);
        socket.emit('conversation:joined', { conversationId });
      } catch (err) {
        socket.emit('error', { message: 'Failed to join conversation room.' });
      }
    });

    // Leave conversation room
    socket.on('conversation:leave', (conversationId: string) => {
      if (conversationId) {
        socket.leave(`conversation:${conversationId}`);
      }
    });

    // Typing indicators with participant verification
    socket.on('typing:start', async ({ conversationId }: { conversationId: string }) => {
      if (!conversationId) return;
      try {
        const participant = await prisma.conversationParticipant.findUnique({
          where: {
            conversationId_userId: {
              conversationId,
              userId,
            },
          },
        });
        if (participant) {
          socket.to(`conversation:${conversationId}`).emit('typing:status', {
            conversationId,
            userId,
            isTyping: true,
          });
        }
      } catch {
        // Ignore
      }
    });

    socket.on('typing:stop', async ({ conversationId }: { conversationId: string }) => {
      if (!conversationId) return;
      try {
        const participant = await prisma.conversationParticipant.findUnique({
          where: {
            conversationId_userId: {
              conversationId,
              userId,
            },
          },
        });
        if (participant) {
          socket.to(`conversation:${conversationId}`).emit('typing:status', {
            conversationId,
            userId,
            isTyping: false,
          });
        }
      } catch {
        // Ignore
      }
    });

    // Realtime message dispatch with strict participant validation and database persistence
    socket.on('message:send', async ({ conversationId, content }: { conversationId: string; content: string }) => {
      if (!conversationId || !content || !content.trim()) return;

      try {
        // 1. Authorize: sender MUST be a member of the conversation
        const participant = await prisma.conversationParticipant.findUnique({
          where: {
            conversationId_userId: {
              conversationId,
              userId,
            },
          },
        });

        if (!participant) {
          socket.emit('error', { message: 'Unauthorized: Cannot send messages to conversations you are not in.' });
          return;
        }

        // 2. Persist message to PostgreSQL database
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

        // 3. Update conversation last activity timestamp
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        });

        // 4. Broadcast in real time to all sockets in conversation room (including sender confirmation)
        io.to(`conversation:${conversationId}`).emit('message:received', message);

        // 5. Also notify other participants directly in their personal user rooms in case they haven't opened the room yet
        const allParticipants = await prisma.conversationParticipant.findMany({
          where: { conversationId },
        });

        for (const p of allParticipants) {
          if (p.userId !== userId) {
            io.to(`user:${p.userId}`).emit('conversation:updated', {
              conversationId,
              lastMessage: {
                id: message.id,
                content: message.content,
                createdAt: message.createdAt,
                senderId: message.senderId,
              },
            });
          }
        }
      } catch (err: any) {
        console.error('[Socket] message:send error:', err.message);
        socket.emit('error', { message: 'Failed to deliver message to database.' });
      }
    });

    socket.on('disconnect', async () => {
      try {
        await prisma.profile.updateMany({
          where: { userId },
          data: { onlineStatus: 'offline' },
        });
        io.emit('user:status_change', { userId, status: 'offline' });
      } catch {
        // Ignore
      }
    });
  });
}
