import { Router } from 'express';
import {
  getNetworkSummary,
  getSuggestions,
  sendConnectionRequest,
  respondConnectionRequest,
} from './networking.controller.js';
import { requireAuth } from '../../middleware/authentication.js';

export const networkingRouter = Router();

networkingRouter.get('/summary', requireAuth, getNetworkSummary);
networkingRouter.get('/suggestions', getSuggestions);
networkingRouter.post('/request', requireAuth, sendConnectionRequest);
networkingRouter.post('/request/:requestId/respond', requireAuth, respondConnectionRequest);
