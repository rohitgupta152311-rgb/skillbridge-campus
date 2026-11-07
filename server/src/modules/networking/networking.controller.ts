import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { AppError } from '../../middleware/error-handler.js';

export async function getNetworkSummary(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const userId = req.user.id;

    const [connections, pendingReceived, pendingSent, following, followers] = await Promise.all([
      prisma.connection.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
          status: 'ACCEPTED',
        },
        include: {
          sender: { include: { profile: true } },
          receiver: { include: { profile: true } },
        },
      }),
      prisma.connection.findMany({
        where: { receiverId: userId, status: 'PENDING' },
        include: { sender: { include: { profile: true } } },
      }),
      prisma.connection.findMany({
        where: { senderId: userId, status: 'PENDING' },
        include: { receiver: { include: { profile: true } } },
      }),
      prisma.follow.findMany({
        where: { followerId: userId },
        include: { following: { include: { profile: true } } },
      }),
      prisma.follow.findMany({
        where: { followingId: userId },
        include: { follower: { include: { profile: true } } },
      }),
    ]);

    const formattedConnections = connections.map((c) => {
      const other = c.senderId === userId ? c.receiver : c.sender;
      return {
        connectionId: c.id,
        connectedSince: c.updatedAt,
        user: {
          id: other.id,
          role: other.role,
          profile: other.profile,
        },
      };
    });

    return res.json({
      success: true,
      data: {
        connectionsCount: formattedConnections.length,
        connections: formattedConnections,
        pendingReceived: pendingReceived.map((c) => ({
          requestId: c.id,
          createdAt: c.createdAt,
          fromUser: { id: c.sender.id, role: c.sender.role, profile: c.sender.profile },
        })),
        pendingSentCount: pendingSent.length,
        followingCount: following.length,
        followersCount: followers.length,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function getSuggestions(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { university, excludeUniversity, search, limit } = req.query as {
      university?: string;
      excludeUniversity?: string;
      search?: string;
      limit?: string;
    };

    const where: any = {
      isSuspended: false,
    };
    if (userId) {
      where.id = { not: userId };
    }

    if (search) {
      where.OR = [
        { profile: { fullName: { contains: search, mode: 'insensitive' } } },
        { profile: { department: { contains: search, mode: 'insensitive' } } },
        { profile: { university: { contains: search, mode: 'insensitive' } } },
        { userSkills: { some: { skill: { name: { contains: search, mode: 'insensitive' } } } } },
      ];
    }

    if (university) {
      where.profile = {
        ...(where.profile || {}),
        university: { contains: university, mode: 'insensitive' },
      };
    } else if (excludeUniversity) {
      where.profile = {
        ...(where.profile || {}),
        university: { not: { contains: excludeUniversity, mode: 'insensitive' } },
      };
    }

    const take = limit ? Math.min(parseInt(limit, 10), 100) : 50;

    const users = await prisma.user.findMany({
      where,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        profile: true,
        userSkills: { include: { skill: true } },
      },
    });

    return res.json({
      success: true,
      data: users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        isVerified: u.isVerified,
        fullName: u.profile?.fullName || 'Student Peer',
        avatar: u.profile?.avatarUrl,
        headline: u.profile?.headline,
        bio: u.profile?.bio,
        university: u.profile?.university || 'Campus University',
        department: u.profile?.department || 'General Engineering',
        year: u.profile?.currentYear || '1st Year',
        onlineStatus: u.profile?.onlineStatus || 'offline',
        profile: u.profile,
        skills: u.userSkills.map((s) => s.skill.name),
        skillsOffered: u.userSkills.map((s) => ({
          skillName: s.skill.name,
          category: s.skill.category || 'General',
          proficiency: s.proficiency >= 4 ? 'advanced' : s.proficiency >= 2 ? 'intermediate' : 'beginner',
        })),
        skillsWanted: [],
      })),
    });
  } catch (error) {
    return next(error);
  }
}

export async function sendConnectionRequest(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { targetUserId } = req.body;

    if (targetUserId === req.user.id) {
      throw new AppError('Cannot connect with yourself.', 400);
    }

    const existing = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: req.user.id },
        ],
      },
    });

    if (existing) {
      if (existing.status === 'ACCEPTED') {
        throw new AppError('You are already connected with this user.', 400);
      }
      if (existing.status === 'PENDING') {
        throw new AppError('A connection request is already pending.', 400);
      }
      // Re-open if previously rejected/withdrawn
      const updated = await prisma.connection.update({
        where: { id: existing.id },
        data: { senderId: req.user.id, receiverId: targetUserId, status: 'PENDING' },
      });
      return res.json({ success: true, message: 'Connection request sent.', data: updated });
    }

    const connection = await prisma.connection.create({
      data: {
        senderId: req.user.id,
        receiverId: targetUserId,
        status: 'PENDING',
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: 'CONNECTION_REQUEST',
        title: 'New Connection Request',
        message: 'Someone requested to connect with your professional network.',
        linkUrl: '/network',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Connection request sent.',
      data: connection,
    });
  } catch (error) {
    return next(error);
  }
}

export async function respondConnectionRequest(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { requestId } = req.params;
    const { action } = req.body; // 'ACCEPT' | 'REJECT' | 'WITHDRAW'

    const connection = await prisma.connection.findUnique({
      where: { id: requestId },
    });

    if (!connection) {
      throw new AppError('Connection request not found.', 404);
    }

    if (action === 'ACCEPT' || action === 'REJECT') {
      if (connection.receiverId !== req.user.id) {
        throw new AppError('Only the recipient can accept or reject this request.', 403);
      }
      const updated = await prisma.connection.update({
        where: { id: requestId },
        data: { status: action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED' },
      });

      if (action === 'ACCEPT') {
        await prisma.notification.create({
          data: {
            userId: connection.senderId,
            type: 'CONNECTION_ACCEPTED',
            title: 'Connection Accepted',
            message: 'Your connection request was accepted.',
            linkUrl: '/network',
          },
        });
      }

      return res.json({ success: true, message: `Request ${action.toLowerCase()}ed.`, data: updated });
    }

    if (action === 'WITHDRAW') {
      if (connection.senderId !== req.user.id) {
        throw new AppError('Only the sender can withdraw this request.', 403);
      }
      await prisma.connection.delete({ where: { id: requestId } });
      return res.json({ success: true, message: 'Request withdrawn.' });
    }

    throw new AppError('Invalid action.', 400);
  } catch (error) {
    return next(error);
  }
}
