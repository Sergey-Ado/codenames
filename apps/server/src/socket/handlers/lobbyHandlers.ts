import { TypedServerIo, TypedSocket } from '../../types/types.ts';

export function sendLobbyState(io: TypedServerIo, socket: TypedSocket) {
  return async (): Promise<void> => {
    const data = await import('../data/roomPreviews.json');

    const roomPreviews = data.default;

    io.to(socket.id).emit('lobby:send-state', roomPreviews);
  };
}
