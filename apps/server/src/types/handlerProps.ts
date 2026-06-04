import { TypedRole, TypedTeam } from '@repo/shared/room';

export interface IRoomAddTeamAddRole {
  teamType: TypedTeam;
  role: TypedRole;
}
