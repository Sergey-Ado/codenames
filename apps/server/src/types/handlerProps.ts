import { TypedRole, RoomTeamType } from '@repo/shared/room';

export interface IRoomAddTeamAddRole {
  teamType: RoomTeamType;
  role: TypedRole;
}

export type EmptyCallback = () => void;
