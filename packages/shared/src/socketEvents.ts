import { RoomPreview, RoomState, TypedRole, TypedTeam } from './types/room.ts';
import { Player } from './types/user.ts';

export enum TimerDurations {
  GAME_START = 15,
}
export type SocketErrorCodes = 'AUTH_REQUIRED';

export type ClientEvent =
  | { type: 'session:ask-status' }
  | { type: 'lobby:ask-state' }
  | { type: 'lobby:enter-to-room'; payload: { roomId: string } }
  | { type: 'lobby:leave-room' }
  | { type: 'lobby:create-room'; payload: { name: string; count: number } }
  | { type: 'lobby:search-rooms'; payload: { key: string } }
  | { type: 'room:ask-state' }
  | {
      type: 'room:add-team-and-role';
      payload: { teamType: TypedTeam; role: TypedRole };
    };

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
  | { type: 'lobby:removed-room'; payload: { roomId: string } }
  | { type: 'lobby:created-room'; payload: { roomPreview: RoomPreview } }
  | {
      type: 'room:send-state';
      payload: { roomState: RoomState };
    }
  | {
      type: 'room:removed-team-and-role';
      payload: { userId: string; teamType: TypedTeam; role: TypedRole };
    }
  | {
      type: 'room:added-team-and-role';
      payload: { player: Player; teamType: TypedTeam; role: TypedRole };
    }
  | { type: 'room:started-game-start-timer' }
  | { type: 'room:started-game' };

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
