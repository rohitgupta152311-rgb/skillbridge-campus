import { Router } from 'express';
import {
  getDashboardMetrics,
  toggleUserSuspension,
  verifyMentor,
  listReports,
  resolveReport,
} from './admin.controller.js';
import { requireAuth, requireRoles } from '../../middleware/authentication.js';

export const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.use(requireRoles('ADMIN'));

adminRouter.get('/metrics', getDashboardMetrics);
adminRouter.put('/users/:userId/suspend', toggleUserSuspension);
adminRouter.put('/users/:userId/verify', verifyMentor);
adminRouter.get('/reports', listReports);
adminRouter.put('/reports/:reportId/resolve', resolveReport);
