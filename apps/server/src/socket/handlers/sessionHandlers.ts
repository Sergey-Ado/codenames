import { userStatus } from '@repo/shared/socketEvents';
import { TypedServerIo, TypedSocket } from '../../types/types.ts';

export function sendStatus(io: TypedServerIo, socket: TypedSocket) {
  return (): void => {
    const { userId, username } = socket.data;

    io.emit('session:send-status', {
      userId,
      username,
      userStatus: userStatus.IN_LOBBY,
    });
  };
}
