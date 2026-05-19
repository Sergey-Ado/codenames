import { RoomPreview } from '@repo/shared/room';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@repo/shared/socketEvents';
import { Socket } from 'socket.io-client';

export function getPageLoaders(
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
) {
  const lobbyLoader = async () => {
    const roomPreviews = await new Promise<RoomPreview[]>(res => {
      socket.emit('lobby:ask-state');

      socket.on('lobby:send-state', ({ roomPreviews }) => {
        res(roomPreviews);
      });
    });

    return { roomPreviews };
  };

  return { lobbyLoader };
}
