import { TypedServerIo, TypedSocket } from '../../types/types.ts';
import { RoomManager } from '../roomManager/roomManager.ts';

export function sendLobbyState(io: TypedServerIo, socket: TypedSocket) {
  return (): void => {
    const roomManager = new RoomManager();

    const roomPreviews = roomManager.getLobbyState();

    io.to(socket.id).emit('lobby:send-state', { roomPreviews });
  };
}
