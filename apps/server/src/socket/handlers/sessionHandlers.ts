import { TypedServerIo, TypedSocket } from '../../types/types.ts';
import { RoomManager } from '../roomManager/roomManager.ts';

export function sendStatus(io: TypedServerIo, socket: TypedSocket) {
  return (): void => {
    const { userId, username } = socket.data;
    const roomManager = new RoomManager();

    io.emit('session:send-status', {
      userId,
      username,
      userStatus: roomManager.getUserStatus({ id: userId, username }),
    });
  };
}
