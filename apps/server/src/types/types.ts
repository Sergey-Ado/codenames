import { Server, Socket } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@repo/shared/socketEvents';
import { Team } from '../socket/roomManager/team.ts';

export interface SocketData {
  userId: string;
  username: string;
}

export type TypedServerIo = Server<ClientToServerEvents, ServerToClientEvents>;

export type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  object,
  SocketData
>;

export type SocketIdsMap = Map<string, Set<string>>;

export type HandlerData = {
  io: TypedServerIo;
  socket: TypedSocket;
  socketIdsMap: SocketIdsMap;
};

export const KEY_FOR_SHOW_KEY = 'yes';

export interface Teams {
  red: Team;
  blue: Team;
}
