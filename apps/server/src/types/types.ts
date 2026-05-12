import { Server, Socket } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@repo/shared/socketEvents';

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
