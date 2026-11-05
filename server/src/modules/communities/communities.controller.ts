import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { AppError } from '../../middleware/error-handler.js';

export async function listCommunities(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;

    const communities = await prisma.community.findMany({
      include: {
        _count: {
          select: { memberships: true, posts: true },
        },
        memberships: userId
          ? {
              where: { userId },
              select: { role: true },
            }
          : false,
      },
      orderBy: { memberships: { _count: 'desc' } },
    });

    const formatted = communities.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      coverImage: c.coverImage,
      iconImage: c.iconImage,
      isPrivate: c.isPrivate,
      membersCount: c._count.memberships,
      postsCount: c._count.posts,
      isMember: userId ? c.memberships?.length > 0 : false,
      userRole: userId && c.memberships?.length > 0 ? c.memberships[0].role : null,
    }));

    return res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCommunity(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        _count: { select: { memberships: true, posts: true } },
        posts: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: {
            author: { include: { profile: true } },
            _count: { select: { reactions: true, comments: true } },
          },
        },
        memberships: userId
          ? {
              where: { userId },
              select: { role: true },
            }
          : false,
      },
    });

    if (!community) {
      throw new AppError('Community not found.', 404);
    }

    return res.json({
      success: true,
      data: {
        ...community,
        membersCount: community._count.memberships,
        postsCount: community._count.posts,
        isMember: userId ? community.memberships?.length > 0 : false,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function toggleMembership(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { communityId } = req.params;

    const existing = await prisma.communityMembership.findUnique({
      where: {
        communityId_userId: {
          communityId,
          userId: req.user.id,
        },
      },
    });

    if (existing) {
      await prisma.communityMembership.delete({ where: { id: existing.id } });
      return res.json({ success: true, message: 'Left community.', isMember: false });
    }

    await prisma.communityMembership.create({
      data: {
        communityId,
        userId: req.user.id,
        role: 'MEMBER',
      },
    });

    return res.status(201).json({ success: true, message: 'Joined community.', isMember: true });
  } catch (error) {
    return next(error);
  }
}
