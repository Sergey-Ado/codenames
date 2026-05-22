import { RoomPreview, RoomState } from './types/room.ts';

export type SocketErrorCodes = 'AUTH_REQUIRED';

export type ClientEvent =
  | { type: 'session:ask-status' }
  | { type: 'lobby:ask-state' }
  | { type: 'lobby:enter-to-room'; payload: { roomId: string } }
  | { type: 'lobby:leave-room' }
  | { type: 'room:ask-state' };

export type ServerEvent =
  | {
      type: 'session:send-status';
      payload: { userStatus: string; userId: string; username: string };
    }
  | { type: 'lobby:send-state'; payload: { roomPreviews: RoomPreview[] } }
  | {
      type: 'lobby:entered-to-room';
      payload: { userId: string };
    }
  | {
      type: 'lobby:update-preview';
      payload: { roomPreview: RoomPreview };
    }
  | {
      type: 'lobby:left-room';
      payload: { userId: string };
    }
  | {
      type: 'room:send-state';
      payload: { roomState: RoomState };
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
