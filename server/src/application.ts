import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './configuration/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { checkDatabaseConnection } from './database/prisma.js';

// Route imports
import { authRouter } from './modules/authentication/auth.routes.js';
import { postsRouter } from './modules/posts/posts.routes.js';
import { networkingRouter } from './modules/networking/networking.routes.js';
import { profilesRouter } from './modules/profiles/profiles.routes.js';
import { communitiesRouter } from './modules/communities/communities.routes.js';
import { mentorshipRouter } from './modules/mentorship/mentorship.routes.js';
import { messagingRouter } from './modules/messaging/messaging.routes.js';
import { notificationsRouter } from './modules/notifications/notifications.routes.js';
import { adminRouter } from './modules/administration/admin.routes.js';
import { uploadRouter } from './modules/uploads/upload.routes.js';

export function createApplication() {
  const app = express();

  // Security & Middleware
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );

  // Allow web, localhost, and mobile client access
  app.use(
    cors({
      origin: (origin, callback) => {
        // Native mobile applications or server-to-server requests have no origin
        if (!origin) return callback(null, true);
        const allowedOrigins = [
          env.FRONTEND_URL,
          'http://localhost:5173',
          'http://localhost:3000',
          'http://localhost:8081',
          'http://localhost:19006',
        ];
        if (allowedOrigins.includes(origin) || origin.endsWith('.render.com') || origin.endsWith('.vercel.app')) {
          return callback(null, true);
        }
        return callback(null, true); // Permissive for campus demo cross-network
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  if (env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Production-ready health check endpoint (both /health and /api/health)
  const healthHandler = async (_req: express.Request, res: express.Response) => {
    const isDbConnected = await checkDatabaseConnection();
    const status = isDbConnected ? 'UP' : 'DEGRADED';
    const httpStatus = isDbConnected ? 200 : 503;

    return res.status(httpStatus).json({
      status,
      timestamp: new Date().toISOString(),
      service: 'skillbridge-server',
      version: '3.0.0',
      database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED',
      uptime: process.uptime(),
      features: {
        linkedInAutoImport: true,
        cloudObjectStorage: true,
        realtimeWebSockets: true,
        mobileOtaSync: true,
      },
    });
  };

  app.get('/health', healthHandler);
  app.get('/api/health', healthHandler);

  // REST API v1 Routes
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/posts', postsRouter);
  app.use('/api/v1/network', networkingRouter);
  app.use('/api/v1/profiles', profilesRouter);
  app.use('/api/v1/communities', communitiesRouter);
  app.use('/api/v1/mentorship', mentorshipRouter);
  app.use('/api/v1/messages', messagingRouter);
  app.use('/api/v1/notifications', notificationsRouter);
  app.use('/api/v1/admin', adminRouter);
  app.use('/api/v1/uploads', uploadRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
