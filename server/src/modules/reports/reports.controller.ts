import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { AppError } from '../../middleware/error-handler.js';

export async function createReport(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { reportedUserId, reason, description } = req.body;

    if (!reportedUserId || !reason) {
      throw new AppError('Reported user ID and reason are required.', 400);
    }

    if (reportedUserId === req.user.id) {
      throw new AppError('You cannot file a report against yourself.', 400);
    }

    const reportedUser = await prisma.user.findUnique({
      where: { id: reportedUserId },
    });

    if (!reportedUser) {
      throw new AppError('Reported user not found.', 404);
    }

    const report = await prisma.userReport.create({
      data: {
        reporterId: req.user.id,
        reportedUserId,
        reason,
        description: description || 'Report submitted by campus member.',
        status: 'PENDING',
      },
    });

    // Create an audit log visible to administrators
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'SAFETY_REPORT_FILED',
        entityType: 'UserReport',
        entityId: report.id,
        details: {
          reportedUserId,
          reason,
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Your safety report has been filed and routed to authorized campus moderators.',
      data: {
        id: report.id,
        status: report.status,
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
}
