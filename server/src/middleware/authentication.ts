import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../configuration/env.js';
import { AppError } from './error-handler.js';

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

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required. Missing token.', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
    req.user = payload;
    return next();
  } catch (err) {
    return next(new AppError('Invalid or expired authentication token.', 401));
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
