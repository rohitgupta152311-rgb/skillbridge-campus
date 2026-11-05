import { Router } from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
} from './messaging.controller.js';
import { requireAuth } from '../../middleware/authentication.js';

export const messagingRouter = Router();

messagingRouter.get('/conversations', requireAuth, getConversations);
messagingRouter.get('/conversations/:conversationId/messages', requireAuth, getMessages);
messagingRouter.post('/conversations/:conversationId/messages', requireAuth, sendMessage);
