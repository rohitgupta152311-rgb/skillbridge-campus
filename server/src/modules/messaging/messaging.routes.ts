import { Router } from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
} from './messaging.controller.js';
import { requireAuth } from '../../middleware/authentication.js';

export const messagingRouter = Router();

// Conversation list and creation
messagingRouter.get('/conversations', requireAuth, getConversations);
messagingRouter.post('/conversations', requireAuth, startConversation);
messagingRouter.post('/conversations/start', requireAuth, startConversation);

// Get messages in a conversation (both formats supported for web and mobile)
messagingRouter.get('/conversations/:conversationId/messages', requireAuth, getMessages);
messagingRouter.get('/conversations/:conversationId', requireAuth, getMessages);
messagingRouter.get('/:conversationId', requireAuth, getMessages);

// Send message to conversation (both formats supported for web and mobile)
messagingRouter.post('/conversations/:conversationId/messages', requireAuth, sendMessage);
messagingRouter.post('/conversations/:conversationId', requireAuth, sendMessage);
messagingRouter.post('/:conversationId', requireAuth, sendMessage);
