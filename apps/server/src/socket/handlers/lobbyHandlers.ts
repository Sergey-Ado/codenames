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

    const response = roomManager.moveFromLobbyToRoom(userId, payload.roomId);

    if (response) {
      const { userId, roomPreview, lobbyIds } = response;

      const socketIds = socketIdsMap.get(userId);
      if (socketIds) {
        for (const socketId of socketIds) {
          io.to(socketId).emit('lobby:entered-to-room', { userId });
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

export function leaveRoom(handleData: HandlerData) {
  const { io, socket, socketIdsMap } = handleData;

  return (): void => {
    const roomManager = getRoomManager();
    const { userId } = socket.data;
    console.log('leave room', userId);

    const response = roomManager.moveFromRoomToLobby(userId);
    if (response) {
      const { roomPreview, lobbyIds } = response;
      console.log(roomPreview, lobbyIds);

      const socketIds = socketIdsMap.get(userId);
      if (socketIds) {
        for (const socketId of socketIds) {
          io.to(socketId).emit('lobby:left-room', { userId });
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
