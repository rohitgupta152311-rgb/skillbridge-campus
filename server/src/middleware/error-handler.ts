import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error | AppError | ZodError | any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  const statusCode = (err && typeof err.statusCode === 'number') ? err.statusCode : (err instanceof AppError ? err.statusCode : null);
  const isOperational = (err && (err.isOperational === true || err.name === 'AppError')) || err instanceof AppError;

  if (statusCode && (isOperational || statusCode < 500)) {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error('Unhandled Server Error:', err);

  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}
