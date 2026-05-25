import { ServerToClientEvents } from '@repo/shared/socketEvents';
import { HandlerData } from '../../types/types.ts';
import { getLogger } from '../logger/logger.ts';

export function getSender(handlerData: HandlerData) {
  const { io, socketIdsMap } = handlerData;

  return <T extends keyof ServerToClientEvents>(
    event: T,
    payload: ServerToClientEvents[T] extends (argument: infer P) => void
      ? P
      : never,
    userIds: string[]
  ): void => {
    const logger = getLogger();

    for (const userId of userIds) {
      const socketIds = socketIdsMap.get(userId);

      if (socketIds) {
        for (const socketId of socketIds) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (io.to(socketId) as any).emit(event, payload);
        }

        logger.emit([userId], event, payload);
      }
    }
  };
}
