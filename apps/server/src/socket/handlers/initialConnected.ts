import { TypedServerIo, TypedSocket } from '../../types/types.ts';
import {
  createRoom,
  enterToRoom,
  leaveRoom,
  searchRooms,
  sendLobbyState,
} from './lobbyHandlers.ts';
import { disconnect, sendStatus } from './sessionHandlers.ts';
import { sendRoomState, updateTeamAndRole } from './roomHandlers.ts';
import { getSocketMiddleware } from '../middlewares/socketMiddleware.ts';
import { initialSocketStores } from './initialSocketStores.ts';

export const initialConnected = (io: TypedServerIo) => {
  console.log('call initialConnected');
  return (socket: TypedSocket): void => {
    const { userId } = socket.data;

    const middleware = getSocketMiddleware(userId);
    socket.use(middleware);

    const { socketIdsMap, roomManager } = initialSocketStores();

    const socketIds = socketIdsMap.get(userId);

    if (socketIds) {
      socketIds.add(socket.id);
      socketIdsMap.set(userId, socketIds);
    } else {
      socketIdsMap.set(userId, new Set([socket.id]));
    }

    const handleData = { io, socket, socketIdsMap, roomManager };

    socket.on('session:ask-status', sendStatus(handleData));
    socket.on('disconnect', disconnect(handleData));

    socket.on('lobby:ask-state', sendLobbyState(handleData));
    socket.on('lobby:enter-to-room', enterToRoom(handleData));
    socket.on('lobby:leave-room', leaveRoom(handleData));
    socket.on('lobby:create-room', createRoom(handleData));
    socket.on('lobby:search-rooms', searchRooms(handleData));

    socket.on('room:ask-state', sendRoomState(handleData));
    socket.on('room:add-team-and-role', updateTeamAndRole(handleData));
  };
};
