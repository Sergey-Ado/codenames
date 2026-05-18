import { HandlerData } from '../../types/types.ts';
import { RoomManager } from '../roomManager/roomManager.ts';

export function sendStatus(handleData: HandlerData) {
  const { io, socket, socketIdsMap } = handleData;

  return (): void => {
    const { userId, username } = socket.data;
    const roomManager = new RoomManager();

    const socketIds = socketIdsMap.get(userId);
    if (socketIds) {
      for (const socketId of socketIds) {
        io.to(socketId).emit('session:send-status', {
          userId,
          username,
          userStatus: roomManager.getUserStatus({ id: userId, username }),
        });
      }
    }
  };
}

export function disconnect(handlerData: HandlerData) {
  const { socket, socketIdsMap } = handlerData;
  const { userId } = socket.data;

  return (): void => {
    const socketIds = socketIdsMap.get(userId);

    if (socketIds) {
      socketIds.delete(socket.id);
    }

    console.log(socketIdsMap);
  };
}
