import { Server, Socket } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@repo/shared/socketEvents';
import { Team } from '../socket/roomManager/team.ts';
import { RoomStatus } from '@repo/shared/room';
import { RoomManager } from '../socket/roomManager/roomManager.ts';

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
  roomManager: RoomManager;
};

export const KEY_FOR_SHOW_KEY = 'yes';

export interface RoomTeams {
  red: Team;
  blue: Team;
}

export interface MockRoom {
  id: string;
  name: string;
  maxCount: number;
  players: Array<{ id: string; username: string }>;
  currentCount: number;
  status: RoomStatus;
  teams: {
    red: {
      spymasterId: string;
      operativeIds: string[];
    };
    blue: {
      spymasterId: string;
      operativeIds: string[];
    };
  };
}
