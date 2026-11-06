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

  // Root landing page for API Gateway
  app.get('/', async (_req: express.Request, res: express.Response) => {
    const isDbConnected = await checkDatabaseConnection();
    res.setHeader('Content-Type', 'text/html');
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SkillBridge API Gateway | CIH-008</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background-color: #0b0f19;
      color: #f1f5f9;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 24px;
    }
    .container {
      max-width: 720px;
      width: 100%;
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    h1 {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.subtitle {
      color: #94a3b8;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }
    .stat-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 16px;
    }
    .stat-label {
      font-size: 12px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
      font-weight: 600;
    }
    .stat-val {
      font-size: 15px;
      font-weight: 700;
      color: #f8fafc;
      font-family: 'JetBrains Mono', monospace;
    }
    .endpoint-list {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 24px;
    }
    .endpoint-title {
      font-size: 13px;
      font-weight: 700;
      color: #cbd5e1;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .endpoint-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #1e293b;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
    }
    .endpoint-item:last-child { border-bottom: none; }
    .method-get { color: #60a5fa; font-weight: 700; }
    .method-post { color: #34d399; font-weight: 700; }
    a.link { color: #818cf8; text-decoration: none; }
    a.link:hover { text-decoration: underline; }
    .footer {
      text-align: center;
      color: #64748b;
      font-size: 12px;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">
      <div class="dot"></div>
      SkillBridge Backend &bull; Live &amp; Operational
    </div>
    <h1>SkillBridge API Gateway</h1>
    <p class="subtitle">
      Smart Peer-to-Peer Tutoring &amp; Mentorship Matchmaker (Challenge ID: CIH-008). 
      Centralized REST API &amp; WebSocket signaling server for skill exchange, project collaboration, and campus networking.
    </p>

    <div class="grid">
      <div class="stat-card">
        <div class="stat-label">Service Status</div>
        <div class="stat-val" style="color: #34d399;">200 OK &bull; Online</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Database</div>
        <div class="stat-val">${isDbConnected ? '<span style="color:#34d399;">PostgreSQL Connected</span>' : '<span style="color:#f87171;">Connecting...</span>'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Architecture</div>
        <div class="stat-val">Express + Prisma + WSS</div>
      </div>
    </div>

    <div class="endpoint-list">
      <div class="endpoint-title">Verified API Routes</div>
      <div class="endpoint-item">
        <span><span class="method-get">GET</span> /health</span>
        <a class="link" href="/health" target="_blank">Health Check &rarr;</a>
      </div>
      <div class="endpoint-item">
        <span><span class="method-get">GET</span> /api/v1/profiles</span>
        <span style="color: #94a3b8;">User Profiles &amp; Skills</span>
      </div>
      <div class="endpoint-item">
        <span><span class="method-get">GET</span> /api/v1/mentorship/matches</span>
        <span style="color: #94a3b8;">5-Factor Matchmaker</span>
      </div>
      <div class="endpoint-item">
        <span><span class="method-post">POST</span> /api/v1/auth/login</span>
        <span style="color: #94a3b8;">JWT Authentication</span>
      </div>
      <div class="endpoint-item">
        <span><span class="method-get">GET</span> /api/v1/posts</span>
        <span style="color: #94a3b8;">Campus Activity Feed</span>
      </div>
    </div>

    <div class="footer">
      SkillBridge &bull; CIH-008 &bull; Deployed on Render Cloud
    </div>
  </div>
</body>
</html>`);
  });

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
