import { HandlerData } from '../../types/types.ts';
import { getRoomManager } from '../roomManager/roomManager.ts';

export function sendLobbyState(handlerData: HandlerData) {
  const { io, socket, socketIdsMap } = handlerData;

  return (): void => {
    const roomManager = getRoomManager();

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
    const roomManager = getRoomManager();
    const { userId } = socket.data;

    const response = roomManager.moveToRoomFromLobby(userId, payload.roomId);

    if (response) {
      const { player, roomPreview, lobbyIds } = response;

      const socketIds = socketIdsMap.get(player.id);
      if (socketIds) {
        for (const socketId of socketIds) {
          io.to(socketId).emit('lobby:entered-to-room', { player });
        }
      }

      for (const lobbyId of lobbyIds) {
        const socketIds = socketIdsMap.get(lobbyId);
        if (socketIds) {
          for (const socketId of socketIds) {
            io.to(socketId).emit('lobby:update-preview', { roomPreview });
          }
        }
      }
    }
  };
}
