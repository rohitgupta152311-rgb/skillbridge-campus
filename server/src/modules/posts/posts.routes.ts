import { Router } from 'express';
import {
  getFeed,
  createPost,
  reactToPost,
  addComment,
  savePost,
} from './posts.controller.js';
import { requireAuth } from '../../middleware/authentication.js';

export const postsRouter = Router();

postsRouter.get('/feed', getFeed);
postsRouter.post('/', requireAuth, createPost);
postsRouter.post('/:postId/react', requireAuth, reactToPost);
postsRouter.post('/:postId/comments', requireAuth, addComment);
postsRouter.post('/:postId/save', requireAuth, savePost);
