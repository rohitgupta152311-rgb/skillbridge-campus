import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createApplication } from './application.js';
import { env } from './configuration/env.js';
import { setupSocketIO } from './modules/messaging/socket.handler.js';
import { prisma } from './database/prisma.js';

async function bootstrap() {
  const app = createApplication();
  const server = http.createServer(app);

  const io = new SocketIOServer(server, {
    cors: {
      origin: [env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
    },
  });

  setupSocketIO(io);
  app.set('io', io);

  server.listen(env.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 SkillBridge Backend Server Running`);
    console.log(`📡 Environment: ${env.NODE_ENV}`);
    console.log(`🌐 Server Port: http://localhost:${env.PORT}`);
    console.log(`🩺 Health Check: http://localhost:${env.PORT}/health`);
    console.log(`⚡ WebSocket / Socket.IO: Initialized`);
    console.log(`=======================================================`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      console.log('HTTP and WebSocket server closed.');
      await prisma.$disconnect();
      console.log('Database connections closed.');
      process.exit(0);
    });

    // Force shutdown after timeout
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('Failed to start SkillBridge server:', err);
  process.exit(1);
});
