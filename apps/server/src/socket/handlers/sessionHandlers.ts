import { SocketIdsMap, TypedServerIo, TypedSocket } from '../../types/types.ts';
import { RoomManager } from '../roomManager/roomManager.ts';

export function sendStatus(
  io: TypedServerIo,
  socket: TypedSocket,
  socketIdsMap: SocketIdsMap
) {
  return (): void => {
    const { userId, username } = socket.data;
    const roomManager = new RoomManager();

    const socketId = socketIdsMap.get(userId);
    if (socketId) {
      io.to(socketId).emit('session:send-status', {
        userId,
        username,
        userStatus: roomManager.getUserStatus({ id: userId, username }),
      });
    }
  };
}
