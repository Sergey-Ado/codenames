import { HttpStatus } from '@repo/shared/api';
import type { Request, Response } from 'express';

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  error: AppError,
  _req: Request,
  res: Response
): void => {
  console.error(error);
  res
    .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: error.message || 'Internal Server Error' });
};
