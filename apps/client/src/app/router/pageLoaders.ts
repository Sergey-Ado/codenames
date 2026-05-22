import { RoomPreview, RoomState } from '@repo/shared/room';
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

    return { roomPreviews, socket };
  };

  const roomLoader = async () => {
    const roomPreview = await new Promise<RoomState>(res => {
      socket.emit('room:ask-state');

      socket.on('room:send-state', ({ roomState }) => {
        res(roomState);
      });
    });

    return { roomPreview, socket };
  };

  return { lobbyLoader, roomLoader };
}
