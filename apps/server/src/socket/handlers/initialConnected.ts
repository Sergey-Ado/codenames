import { ClientToServerEvents } from '@repo/shared/socketEvents';
import { SocketIdsMap, TypedServerIo, TypedSocket } from '../../types/types.ts';
import { getLogger } from '../logger/logger.ts';
import { enterToRoom, leaveRoom, sendLobbyState } from './lobbyHandlers.ts';
import { disconnect, sendStatus } from './sessionHandlers.ts';
import { sendRoomState, updateTeamAndRole } from './roomHandlers.ts';

const socketIdsMap: SocketIdsMap = new Map();

export const initialConnected = (io: TypedServerIo) => {
  console.log('call initialConnected');
  return (socket: TypedSocket): void => {
    const { userId } = socket.data;

    const logger = getLogger();
    socket.use((args, next) => {
      const [event, payload] = args;
      logger.on(userId, event as keyof ClientToServerEvents, payload);
      next();
    });

    const socketIds = socketIdsMap.get(userId);

    if (socketIds) {
      socketIds.add(socket.id);
      socketIdsMap.set(userId, socketIds);
    } else {
      socketIdsMap.set(userId, new Set([socket.id]));
    }

    const handleData = { io, socket, socketIdsMap };

    socket.on('session:ask-status', sendStatus(handleData));
    socket.on('disconnect', disconnect(handleData));

    socket.on('lobby:ask-state', sendLobbyState(handleData));
    socket.on('lobby:enter-to-room', enterToRoom(handleData));
    socket.on('lobby:leave-room', leaveRoom(handleData));

    socket.on('room:ask-state', sendRoomState(handleData));
    socket.on('room:add-team-and-role', updateTeamAndRole(handleData));
  };
};
