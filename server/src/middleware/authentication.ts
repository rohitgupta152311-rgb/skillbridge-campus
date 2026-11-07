import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../configuration/env.js';
import { AppError } from './error-handler.js';
import { prisma } from '../database/prisma.js';
import { FirebaseService } from '../integrations/firebase/firebase.service.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'MENTEE' | 'MENTOR' | 'FACULTY' | 'ALUMNI' | 'ADMIN';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required. Missing token.', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    // 1. First attempt verification with internal application JWT
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
    req.user = payload;
    return next();
  } catch (err) {
    // 2. Fallback: check if the token is a verified Firebase ID Token (Google / GitHub)
    try {
      const fbUser = await FirebaseService.verifyFirebaseIdToken(token);
      const dbUser = await prisma.user.findUnique({
        where: { email: fbUser.email },
      });

      if (dbUser) {
        req.user = {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role as any,
        };
        return next();
      }
    } catch {
      // Ignore and proceed to token rejection
    }

    return next(new AppError('Invalid or expired authentication token.', 401));
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
    req.user = payload;
    return next();
  } catch {
    try {
      const fbUser = await FirebaseService.verifyFirebaseIdToken(token);
      const dbUser = await prisma.user.findUnique({
        where: { email: fbUser.email },
      });

      if (dbUser) {
        req.user = {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role as any,
        };
      }
    } catch {
      // Ignore in optional auth
    }
    return next();
  }
}

export function requireRoles(...allowedRoles: Array<'MENTEE' | 'MENTOR' | 'FACULTY' | 'ALUMNI' | 'ADMIN'>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Access forbidden. Insufficient permissions.', 403));
    }

    return next();
  };
}
