import { Router } from 'express';
import { createReport } from './reports.controller.js';
import { requireAuth } from '../../middleware/authentication.js';

export const reportsRouter = Router();

reportsRouter.post('/', requireAuth, createReport);
