import { Router } from 'express';
import {
  matchMentors,
  bookSession,
  submitReview,
  getUserSessions,
  getSessionById,
  updateSessionStatus,
  rescheduleSession,
  getMentorAvailability,
  downloadSessionIcs,
} from './mentorship.controller.js';
import { requireAuth } from '../../middleware/authentication.js';

export const mentorshipRouter = Router();

// Matching
mentorshipRouter.get('/match', matchMentors);

// Availability
mentorshipRouter.get('/mentors/:mentorId/availability', getMentorAvailability);

// Sessions
mentorshipRouter.get('/sessions', requireAuth, getUserSessions);
mentorshipRouter.post('/sessions/book', requireAuth, bookSession);
mentorshipRouter.get('/sessions/:sessionId', requireAuth, getSessionById);
mentorshipRouter.patch('/sessions/:sessionId/status', requireAuth, updateSessionStatus);
mentorshipRouter.patch('/sessions/:sessionId/reschedule', requireAuth, rescheduleSession);
mentorshipRouter.get('/sessions/:sessionId/ics', downloadSessionIcs);
mentorshipRouter.post('/sessions/:sessionId/review', requireAuth, submitReview);
