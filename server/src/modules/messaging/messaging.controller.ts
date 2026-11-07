import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { AppError } from '../../middleware/error-handler.js';

export async function getConversations(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const userId = req.user.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { userId } },
      },
      include: {
        participants: {
          include: { user: { include: { profile: true } } },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const formatted = conversations.map((conv) => {
      const otherParticipant = conv.participants.find((p) => p.userId !== userId)?.user;
      const lastMessage = conv.messages[0];

      return {
        id: conv.id,
        updatedAt: conv.updatedAt,
        participantIds: conv.participants.map((p) => p.userId),
        otherUser: otherParticipant
          ? {
              id: otherParticipant.id,
              role: otherParticipant.role,
              email: otherParticipant.email,
              profile: otherParticipant.profile,
            }
          : null,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              senderId: lastMessage.senderId,
            }
          : null,
      };
    });

    return res.json({ success: true, data: formatted });
  } catch (error) {
    return next(error);
  }
}

export async function startConversation(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const userId = req.user.id;
    const { recipientId, partnerId, participantId } = req.body;
    const targetId = recipientId || partnerId || participantId;

    if (!targetId) {
      throw new AppError('Recipient ID is required.', 400);
    }

    if (targetId === userId) {
      throw new AppError('Cannot start a conversation with yourself.', 400);
    }

    // Find recipient by ID or email
    let recipient = await prisma.user.findUnique({
      where: { id: targetId },
      include: { profile: true },
    });

    if (!recipient) {
      recipient = await prisma.user.findFirst({
        where: { email: targetId },
        include: { profile: true },
      });
    }

    if (!recipient) {
      throw new AppError('Recipient user not found.', 404);
    }

    // Check if conversation already exists between the two users
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: recipient.id } } },
        ],
      },
      include: {
        participants: {
          include: { user: { include: { profile: true } } },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [
              { userId },
              { userId: recipient.id },
            ],
          },
        },
        include: {
          participants: {
            include: { user: { include: { profile: true } } },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    const otherParticipant = conversation.participants.find((p) => p.userId !== userId)?.user;
    const lastMessage = conversation.messages[0];

    return res.status(200).json({
      success: true,
      data: {
        id: conversation.id,
        updatedAt: conversation.updatedAt,
        participantIds: conversation.participants.map((p) => p.userId),
        otherUser: otherParticipant
          ? {
              id: otherParticipant.id,
              role: otherParticipant.role,
              email: otherParticipant.email,
              profile: otherParticipant.profile,
            }
          : null,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              senderId: lastMessage.senderId,
            }
          : null,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { conversationId } = req.params;

    // Check authorization: must be participant or platform admin
    const isParticipant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: req.user.id,
        },
      },
    });

    if (!isParticipant && req.user.role !== 'ADMIN') {
      throw new AppError('You are not authorized to view this conversation.', 403);
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { include: { profile: true } },
      },
    });

    return res.json({ success: true, data: messages });
  } catch (error) {
    return next(error);
  }
}

export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      throw new AppError('Message content cannot be empty.', 400);
    }

    const isParticipant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: req.user.id,
        },
      },
    });

    if (!isParticipant) {
      throw new AppError('You are not a participant in this conversation.', 403);
    }

    const [message] = await Promise.all([
      prisma.message.create({
        data: {
          conversationId,
          senderId: req.user.id,
          content: content.trim(),
        },
        include: {
          sender: { include: { profile: true } },
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    // Broadcast realtime event via Socket.IO if available
    const io = req.app.get('io');
    if (io) {
      io.to(`conversation:${conversationId}`).emit('message:received', message);

      // Notify other participants in their personal user rooms
      prisma.conversationParticipant.findMany({
        where: { conversationId },
      }).then((participants) => {
        for (const p of participants) {
          if (p.userId !== req.user!.id) {
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
      }).catch((e) => console.error('[Messaging] Broadcast error:', e));
    }

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    return next(error);
  }
}
