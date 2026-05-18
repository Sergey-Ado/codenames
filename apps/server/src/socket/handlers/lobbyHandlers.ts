import { HandlerData } from '../../types/types.ts';
import { RoomManager } from '../roomManager/roomManager.ts';

export function sendLobbyState(handlerData: HandlerData) {
  const { io, socket, socketIdsMap } = handlerData;

  return (): void => {
    const roomManager = new RoomManager();

    const roomPreviews = roomManager.getLobbyState();

    const { userId } = socket.data;

    const socketIds = socketIdsMap.get(userId);
    if (socketIds) {
      for (const socketId of socketIds) {
        io.to(socketId).emit('lobby:send-state', { roomPreviews });
      }
    }
  };
}

export function enterToRoom(handlerData: HandlerData) {
  const { io, socket, socketIdsMap } = handlerData;

  return (payload: { roomId: string }): void => {
    const roomManager = new RoomManager();
    const { userId } = socket.data;

    const player = roomManager.moveToRoomFromLobby(userId, payload.roomId);

    if (player) {
      const socketIds = socketIdsMap.get(userId);
      if (socketIds) {
        for (const socketId of socketIds) {
          io.to(socketId).emit('lobby:entered-to-room', { player });
        }
      }
    }
  };
}
