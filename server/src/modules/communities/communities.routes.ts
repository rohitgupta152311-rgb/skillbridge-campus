import { Router } from 'express';
import {
  listCommunities,
  getCommunity,
  toggleMembership,
} from './communities.controller.js';
import { requireAuth } from '../../middleware/authentication.js';

export const communitiesRouter = Router();

communitiesRouter.get('/', listCommunities);
communitiesRouter.get('/:slug', getCommunity);
communitiesRouter.post('/:communityId/join-toggle', requireAuth, toggleMembership);
