import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../database/prisma.js';
import { AppError } from '../../middleware/error-handler.js';

const createPostSchema = z.object({
  content: z.string().min(1),
  postType: z.enum(['STANDARD', 'PROJECT_SHOWCASE', 'ACHIEVEMENT', 'ACADEMIC_QUESTION', 'OPPORTUNITY']).default('STANDARD'),
  mediaUrls: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  communityId: z.string().optional(),
});

export async function getFeed(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUserId = req.user?.id;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const skip = (page - 1) * limit;

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            include: { profile: true },
          },
          community: true,
          reactions: {
            include: { user: { include: { profile: true } } },
          },
          comments: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: { author: { include: { profile: true } } },
          },
          savedBy: currentUserId ? { where: { userId: currentUserId } } : true,
          _count: {
            select: {
              reactions: true,
              comments: true,
              savedBy: true,
            },
          },
        },
      }),
      prisma.post.count(),
    ]);

    const formattedPosts = posts.map((post) => {
      const userReaction = currentUserId
        ? post.reactions.find((r) => r.userId === currentUserId)?.type || null
        : null;

      const isSaved = currentUserId
        ? post.savedBy?.some((s) => s.userId === currentUserId) || false
        : false;

      return {
        id: post.id,
        content: post.content,
        postType: post.postType,
        mediaUrls: post.mediaUrls,
        tags: post.tags,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: {
          id: post.author.id,
          email: post.author.email,
          role: post.author.role,
          profile: post.author.profile,
        },
        community: post.community,
        reactionsCount: post._count.reactions,
        commentsCount: post._count.comments,
        userReaction,
        isSaved,
        previewComments: post.comments.map((c) => ({
          id: c.id,
          content: c.content,
          createdAt: c.createdAt,
          author: {
            id: c.author.id,
            profile: c.author.profile,
          },
        })),
      };
    });

    return res.json({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const data = createPostSchema.parse(req.body);

    const post = await prisma.post.create({
      data: {
        authorId: req.user.id,
        content: data.content,
        postType: data.postType,
        mediaUrls: data.mediaUrls,
        tags: data.tags,
        communityId: data.communityId,
      },
      include: {
        author: { include: { profile: true } },
        community: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Post created successfully.',
      data: post,
    });
  } catch (error) {
    return next(error);
  }
}

export async function reactToPost(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { postId } = req.params;
    const type = req.body.type || 'LIKE';

    const existingReaction = await prisma.postReaction.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: req.user.id,
        },
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Toggle off reaction
        await prisma.postReaction.delete({
          where: { id: existingReaction.id },
        });
        return res.json({ success: true, message: 'Reaction removed', userReaction: null });
      } else {
        // Change reaction type
        const updated = await prisma.postReaction.update({
          where: { id: existingReaction.id },
          data: { type },
        });
        return res.json({ success: true, message: 'Reaction updated', userReaction: updated.type });
      }
    }

    const created = await prisma.postReaction.create({
      data: {
        postId,
        userId: req.user.id,
        type,
      },
    });

    return res.json({ success: true, message: 'Reaction added', userReaction: created.type });
  } catch (error) {
    return next(error);
  }
}

export async function addComment(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { postId } = req.params;
    const { content, parentId } = req.body;

    if (!content || !content.trim()) {
      throw new AppError('Comment content cannot be empty.', 400);
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId: req.user.id,
        content: content.trim(),
        parentId,
      },
      include: {
        author: { include: { profile: true } },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Comment added.',
      data: comment,
    });
  } catch (error) {
    return next(error);
  }
}

export async function savePost(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { postId } = req.params;

    const existing = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId,
        },
      },
    });

    if (existing) {
      await prisma.savedPost.delete({ where: { id: existing.id } });
      return res.json({ success: true, isSaved: false, message: 'Post removed from saved collection' });
    }

    await prisma.savedPost.create({
      data: {
        userId: req.user.id,
        postId,
      },
    });

    return res.json({ success: true, isSaved: true, message: 'Post saved to your bookmarks' });
  } catch (error) {
    return next(error);
  }
}
