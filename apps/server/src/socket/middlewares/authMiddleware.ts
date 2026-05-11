import { defaultEnv } from '@repo/shared/api';
import { ExtendedError } from 'socket.io';
import * as z from 'zod';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.ts';
import process from 'node:process';
import { TypedSocket } from '../../types/types.ts';

export const authMiddleware = async (
  socket: TypedSocket,
  next: (error?: ExtendedError | undefined) => void
): Promise<void> => {
  try {
    const token: unknown = socket.handshake.auth.authToken;
    const authToken = z.string().parse(token);

    const secretKey = process.env.JWT_SECRET_KEY || defaultEnv.JWT_SECRET_KEY;
    const payload = jwt.verify(authToken, secretKey);

    const userId = typeof payload === 'string' ? '' : payload.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('No found');

    socket.data.userId = userId;
    socket.data.username = user.username;

    next();
  } catch {
    console.log('AUTH_REQUIRED');
    next(new Error('AUTH_REQUIRED'));
  }
};
