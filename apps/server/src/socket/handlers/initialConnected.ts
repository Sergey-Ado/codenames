import { SocketIdsMap, TypedServerIo, TypedSocket } from '../../types/types.ts';
import { enterToRoom, sendLobbyState } from './lobbyHandlers.ts';
import { sendStatus } from './sessionHandlers.ts';

const socketIdsMap: SocketIdsMap = new Map();

export const initialConnected = (io: TypedServerIo) => {
  console.log('call initialConnected');
  return (socket: TypedSocket): void => {
    const { userId } = socket.data;
    socketIdsMap.set(userId, socket.id);

    socket.on('session:ask-status', sendStatus(io, socket, socketIdsMap));

    socket.on('lobby:ask-state', sendLobbyState(io, socket, socketIdsMap));
    socket.on('lobby:enter-to-room', enterToRoom(io, socket, socketIdsMap));
  };
};
