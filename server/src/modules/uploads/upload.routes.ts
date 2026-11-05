import { Router } from 'express';
import { uploadImage } from './upload.controller.js';
import { requireAuth } from '../../middleware/authentication.js';

export const uploadRouter = Router();

uploadRouter.post('/image', requireAuth, uploadImage);
