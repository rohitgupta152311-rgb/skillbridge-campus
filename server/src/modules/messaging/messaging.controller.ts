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
        otherUser: otherParticipant
          ? {
              id: otherParticipant.id,
              role: otherParticipant.role,
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

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { conversationId } = req.params;

    // Check authorization
    const isParticipant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: req.user.id,
        },
      },
    });

    if (!isParticipant) {
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

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    return next(error);
  }
}
