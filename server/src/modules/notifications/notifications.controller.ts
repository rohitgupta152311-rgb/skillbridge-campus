import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { AppError } from '../../middleware/error-handler.js';

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.id, isRead: false },
    });

    return res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { notificationId } = req.params;

    if (notificationId === 'all') {
      await prisma.notification.updateMany({
        where: { userId: req.user.id, isRead: false },
        data: { isRead: true },
      });
      return res.json({ success: true, message: 'All notifications marked as read.' });
    }

    await prisma.notification.updateMany({
      where: { id: notificationId, userId: req.user.id },
      data: { isRead: true },
    });

    return res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    return next(error);
  }
}
