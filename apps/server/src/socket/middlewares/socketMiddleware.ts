import { ClientToServerEvents } from '@repo/shared/socketEvents';
import { getLogger } from '../logger/logger.ts';
import { Event } from 'socket.io';

export const getSocketMiddleware = (userId: string) => {
  return (args: Event, next: (error?: Error | undefined) => void): void => {
    const logger = getLogger();
    const [event, payload] = args;
    logger.on(userId, event as keyof ClientToServerEvents, payload);
    next();
  };
};
