import { Router } from 'express';
import {
  getDashboardMetrics,
  listUsers,
  getUserDetails,
  updateUserStatus,
  toggleUserSuspension,
  verifyMentor,
  approveUser,
  deleteUser,
  purgeNonWhitelistedUsers,
  listConversations,
  inspectConversation,
  getLiveActivity,
  getAnalytics,
  listAuditLogs,
  listReports,
  resolveReport,
} from './admin.controller.js';
import { requireAuth, requireRoles } from '../../middleware/authentication.js';

export const adminRouter = Router();

// Strict RBAC: All administrative endpoints require valid authentication AND 'ADMIN' role
adminRouter.use(requireAuth);
adminRouter.use(requireRoles('ADMIN'));

// Telemetry & Dashboard
adminRouter.get('/dashboard', getDashboardMetrics);
adminRouter.get('/metrics', getDashboardMetrics);

// User Management & Access Control
adminRouter.get('/users', listUsers);
adminRouter.get('/users/:userId', getUserDetails);
adminRouter.patch('/users/:userId/status', updateUserStatus);
adminRouter.put('/users/:userId/suspend', toggleUserSuspension);
adminRouter.put('/users/:userId/verify', verifyMentor);
adminRouter.put('/users/:userId/approve', approveUser);
adminRouter.delete('/users/:userId', deleteUser);
adminRouter.post('/users/purge-non-whitelisted', purgeNonWhitelistedUsers);

// Safety & Conversation Monitoring (Audit-Logged)
adminRouter.get('/conversations', listConversations);
adminRouter.get('/conversations/:conversationId', inspectConversation);

// Live Activity & Telemetry
adminRouter.get('/activity', getLiveActivity);
adminRouter.get('/analytics', getAnalytics);

// Compliance & Moderation
adminRouter.get('/audit-logs', listAuditLogs);
adminRouter.get('/reports', listReports);
adminRouter.put('/reports/:reportId/resolve', resolveReport);
