import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
} from './notifications.controller.js';
import { requireAuth } from '../../middleware/authentication.js';

export const notificationsRouter = Router();

notificationsRouter.get('/', requireAuth, getNotifications);
notificationsRouter.put('/:notificationId/read', requireAuth, markAsRead);
