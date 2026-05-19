import { RoomPreview } from './types/room.ts';
import { Player } from './types/user.ts';

export type SocketErrorCodes = 'AUTH_REQUIRED';

export type ClientEvent =
  | { type: 'session:ask-status' }
  | { type: 'lobby:ask-state' }
  | { type: 'lobby:enter-to-room'; payload: { roomId: string } };

export type ServerEvent =
  | {
      type: 'session:send-status';
      payload: { userStatus: string; userId: string; username: string };
    }
  | { type: 'lobby:send-state'; payload: { roomPreviews: RoomPreview[] } }
  | {
      type: 'lobby:entered-to-room';
      payload: { player: Player };
    }
  | {
      type: 'lobby:update-preview';
      payload: { roomPreview: RoomPreview };
    };

export enum UserStatus {
  IN_LOBBY = 'in-lobby',
  IN_ROOM = 'in-room',
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
