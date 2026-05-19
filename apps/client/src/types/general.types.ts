import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@repo/shared/socketEvents';
import { Socket } from 'socket.io-client';

export enum Pages {
  WELCOME = '',
  LOGIN = 'login',
  REGISTER = 'register',
  LOBBY = 'lobby',
  ROOM = 'room',
}

export enum StorageConstants {
  PREFIX = 'codenames-',
  AUTH_TOKEN = `${PREFIX}auth-token`,
  USER_ID = `${PREFIX}user-id`,
  USERNAME = `${PREFIX}username`,
}

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
