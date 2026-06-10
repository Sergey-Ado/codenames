import {
  RoomPreview,
  RoomState,
  TypedRole,
  TypedTeam,
} from '@repo/shared/room';
import { Room } from './room.ts';
import { UserStatus } from '@repo/shared/socketEvents';
import { Lobby } from './lobby.ts';
import { Player } from '@repo/shared/user';
import { MockRoom } from '../../types/types.ts';

export class RoomManager {
  private rooms: Room[] = [];
  private lobby = new Lobby();

  public setRooms(mockRooms: MockRoom[]): void {
    this.rooms = mockRooms.map(mockRoom => {
      const room = new Room(mockRoom.name, mockRoom.maxCount);
      room.setData(mockRoom);
      return room;
    });
  }

  public getLobbyState(): RoomPreview[] {
    return this.rooms.map(room => room.getRoomPreview());
  }

  public getUserStatus(player: Player): UserStatus {
    if (this.getRoomByUserId(player.id)) return UserStatus.IN_ROOM;

    if (!this.lobby.hasPlayer(player.id)) {
      this.lobby.addPlayer(player);
    }

    return UserStatus.IN_LOBBY;
  }

  public getRoomById(roomId: string): Room | undefined {
    return this.rooms.find(({ id }) => id === roomId);
  }

  public getRoomByUserId(userId: string): Room | undefined {
    return this.rooms.find(room => room.hasPlayer(userId));
  }

  public moveFromLobbyToRoom(
    userId: string,
    roomId: string
  ):
    | { userId: string; roomPreview: RoomPreview; lobbyIds: string[] }
    | undefined {
    const player = this.lobby.removePlayer(userId);
    const room = this.getRoomById(roomId);

    if (player && room) {
      room.addPlayer(player);
      const userId = player.id;
      const lobbyIds = this.lobby.getPlayerIds();
      const roomPreview = room.getRoomPreview();
      return { userId, roomPreview, lobbyIds };
    }
  }

  public moveFromRoomToLobby(userId: string):
    | {
        roomPreview: RoomPreview;
        lobbyIds: string[];
        teamType: TypedTeam;
        role: TypedRole;
        roomIds: string[];
      }
    | undefined {
    const room = this.getRoomByUserId(userId);

    if (room) {
      const response = room.removePlayer(userId);

      if (response) {
        const { player, teamType, role } = response;

        this.lobby.addPlayer(player);

        const roomPreview = room.getRoomPreview();
        const lobbyIds = this.lobby.getPlayerIds();
        const roomIds = room.getPlayerIds();

        return { roomPreview, lobbyIds, teamType, role, roomIds };
      }
    }
  }

  public getRoomState(userId: string): { roomState: RoomState } | undefined {
    const room = this.getRoomByUserId(userId);
    if (room) {
      const roomState = room.getRoomState();
      return { roomState };
    }
  }

  public removeTeamAndRole(
    userId: string
  ): { teamType: TypedTeam; role: TypedRole; roomIds: string[] } | undefined {
    const room = this.getRoomByUserId(userId);

    if (room) {
      const { teamType, role } = room.removeTeamAndRole(userId);
      const roomIds = room.getPlayerIds();
      return { teamType, role, roomIds };
    }
  }

  public addTeamAndRole(
    userId: string,
    teamType: TypedTeam,
    role: TypedRole
  ):
    | {
        player: Player;
        roomIds: string[];
      }
    | undefined {
    const room = this.getRoomByUserId(userId);

    if (room) {
      const response = room.addTeamAndRole(userId, teamType, role);

      if (response) {
        const { player } = response;
        const roomIds = room.getPlayerIds();
        return { player, roomIds };
      }
    }
  }

  public canUpdateTeamAndRole(
    userId: string,
    teamType: TypedTeam,
    role: TypedRole
  ): boolean {
    const room = this.getRoomByUserId(userId);

    if (room) {
      return room.canUpdateTeamAndRole(userId, teamType, role);
    }

    return false;
  }

  public createRoom(
    userId: string,
    name: string,
    count: number
  ):
    | {
        roomPreview: RoomPreview;
        lobbyIds: string[];
      }
    | undefined {
    const player = this.lobby.removePlayer(userId);

    if (player) {
      const room = new Room(name, count);

      room.addPlayer(player);
      this.rooms.push(room);

      const roomPreview = room.getRoomPreview();
      const lobbyIds = this.lobby.getPlayerIds();

      return { roomPreview, lobbyIds };
    }
  }
}
