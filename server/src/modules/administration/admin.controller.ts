import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { AppError } from '../../middleware/error-handler.js';

export async function getDashboardMetrics(_req: Request, res: Response, next: NextFunction) {
  try {
    const [
      totalUsers,
      totalMentors,
      totalSessions,
      completedSessions,
      totalPosts,
      totalCommunities,
      pendingReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'MENTOR' } }),
      prisma.tutoringSession.count(),
      prisma.tutoringSession.count({ where: { status: 'COMPLETED' } }),
      prisma.post.count(),
      prisma.community.count(),
      prisma.userReport.count({ where: { status: 'PENDING' } }),
    ]);

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalMentors,
        totalSessions,
        completedSessions,
        totalPosts,
        totalCommunities,
        pendingReports,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function toggleUserSuspension(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const { suspend } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isSuspended: Boolean(suspend) },
      include: { profile: true },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: suspend ? 'SUSPEND_USER' : 'UNSUSPEND_USER',
        entityType: 'USER',
        entityId: userId,
        details: { targetEmail: user.email },
      },
    });

    return res.json({
      success: true,
      message: `User ${suspend ? 'suspended' : 'reinstated'} successfully.`,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

export async function verifyMentor(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'VERIFY_MENTOR',
        entityType: 'USER',
        entityId: userId,
      },
    });

    return res.json({
      success: true,
      message: 'Mentor profile verified.',
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

export async function listReports(_req: Request, res: Response, next: NextFunction) {
  try {
    const reports = await prisma.userReport.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { include: { profile: true } },
        reportedUser: { include: { profile: true } },
      },
    });

    return res.json({ success: true, data: reports });
  } catch (error) {
    return next(error);
  }
}

export async function resolveReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { reportId } = req.params;
    const { status, note } = req.body; // 'RESOLVED' | 'DISMISSED'

    const report = await prisma.userReport.update({
      where: { id: reportId },
      data: {
        status: status || 'RESOLVED',
        resolvedAt: new Date(),
        resolutionNote: note,
      },
    });

    return res.json({ success: true, message: 'Report status updated.', data: report });
  } catch (error) {
    return next(error);
  }
}
