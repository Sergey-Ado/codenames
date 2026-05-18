import { SocketIdsMap, TypedServerIo, TypedSocket } from '../../types/types.ts';
import { RoomManager } from '../roomManager/roomManager.ts';

export function sendLobbyState(
  io: TypedServerIo,
  socket: TypedSocket,
  socketIdsMap: SocketIdsMap
) {
  return (): void => {
    const roomManager = new RoomManager();

    const roomPreviews = roomManager.getLobbyState();

    const { userId } = socket.data;

    const socketId = socketIdsMap.get(userId);
    if (socketId) {
      io.to(socketId).emit('lobby:send-state', { roomPreviews });
    }
  };
}

export function enterToRoom(
  io: TypedServerIo,
  socket: TypedSocket,
  socketIdsMap: SocketIdsMap
) {
  return (payload: { roomId: string }): void => {
    const roomManager = new RoomManager();
    const { userId } = socket.data;

    const player = roomManager.moveToRoomFromLobby(userId, payload.roomId);

    if (player) {
      console.log(player);
      const socketId = socketIdsMap.get(userId);
      if (socketId) {
        io.to(socketId).emit('lobby:entered-to-room', { player });
      }
    }
  };
}
