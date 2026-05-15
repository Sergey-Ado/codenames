import { RoomPreview } from './types/room.ts';

export type SocketErrorCodes = 'AUTH_REQUIRED';

export type ClientEvent =
  | {
      type: 'session:ask-status';
    }
  | { type: 'lobby:ask-state' };

export type ServerEvent =
  | {
      type: 'session:send-status';
      payload: { userStatus: string; userId: string; username: string };
    }
  | { type: 'lobby:send-state'; payload: { roomPreviews: RoomPreview[] } };

export enum userStatus {
  IN_LOBBY = 'in-lobby',
}

type EventName<T> = T extends { type: infer K } ? K : never;

type EventPayload<T> = T extends { payload: infer P }
  ? P extends undefined
    ? () => void
    : (data: P) => void
  : () => void;

type DiscriminatedUnionToSocketEvents<T extends { type: string }> = {
  [K in EventName<T>]: EventPayload<Extract<T, { type: K }>>;
};

export type ServerToClientEvents =
  DiscriminatedUnionToSocketEvents<ServerEvent>;

export type ClientToServerEvents =
  DiscriminatedUnionToSocketEvents<ClientEvent>;
