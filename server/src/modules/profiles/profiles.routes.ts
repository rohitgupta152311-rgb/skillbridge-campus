import { Router } from 'express';
import {
  getProfileById,
  updateProfile,
  endorseSkill,
} from './profiles.controller.js';
import { requireAuth } from '../../middleware/authentication.js';

export const profilesRouter = Router();

profilesRouter.get('/:userId', getProfileById);
profilesRouter.put('/me', requireAuth, updateProfile);
profilesRouter.post('/skills/:userSkillId/endorse', requireAuth, endorseSkill);
