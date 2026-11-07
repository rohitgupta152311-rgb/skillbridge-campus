import { Router } from 'express';
import {
  getNetworkSummary,
  getSuggestions,
  sendConnectionRequest,
  respondConnectionRequest,
} from './networking.controller.js';
import { requireAuth, optionalAuth } from '../../middleware/authentication.js';

export const networkingRouter = Router();

networkingRouter.get('/summary', requireAuth, getNetworkSummary);
networkingRouter.get('/suggestions', optionalAuth, getSuggestions);
networkingRouter.post('/request', requireAuth, sendConnectionRequest);
networkingRouter.post('/request/:requestId/respond', requireAuth, respondConnectionRequest);
