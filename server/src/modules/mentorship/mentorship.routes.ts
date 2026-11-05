import { Router } from 'express';
import {
  matchMentors,
  bookSession,
  submitReview,
} from './mentorship.controller.js';
import { requireAuth } from '../../middleware/authentication.js';

export const mentorshipRouter = Router();

mentorshipRouter.get('/match', matchMentors);
mentorshipRouter.post('/sessions/book', requireAuth, bookSession);
mentorshipRouter.post('/sessions/:sessionId/review', requireAuth, submitReview);
