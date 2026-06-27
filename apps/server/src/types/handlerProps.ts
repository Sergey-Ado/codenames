import { RoomRoleType, RoomTeamType } from '@repo/shared/room';

export interface IRoomAddTeamAddRole {
  teamType: RoomTeamType;
  role: RoomRoleType;
}

export type EmptyCallback = () => void;
