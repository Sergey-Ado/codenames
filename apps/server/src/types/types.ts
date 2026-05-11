import { Socket } from 'socket.io';

export interface SocketData {
  userId: string;
  username: string;
}

export type TypedSocket = Socket<object, object, object, SocketData>;
