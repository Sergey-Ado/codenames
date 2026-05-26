import {
  RoomPreview,
  RoomState,
  TypedRole,
  TypedTeam,
} from '@repo/shared/room';
import { mockRooms } from '../data/mockRooms.ts';
import { Room } from './room.ts';
import { UserStatus } from '@repo/shared/socketEvents';
import { Lobby } from './lobby.ts';
import { Player } from '@repo/shared/user';

class RoomManager {
  private static instance: RoomManager | undefined;
  private rooms: Room[] = [];
  private lobby = new Lobby();

  public constructor() {
    if (RoomManager.instance) return RoomManager.instance;

    this.rooms = mockRooms.map(mockRoom => {
      const room = new Room();
      room.setData(mockRoom);
      return room;
    });

    RoomManager.instance = this;
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
      }
    | undefined {
    const room = this.getRoomByUserId(userId);

    if (room) {
      const player = room.removePlayer(userId);
      if (player) {
        this.lobby.addPlayer(player);
      }
      const roomPreview = room.getRoomPreview();
      const lobbyIds = this.lobby.getPlayerIds();
      return { roomPreview, lobbyIds };
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
  ): { team: TypedTeam; role: TypedRole; roomIds: string[] } | undefined {
    const room = this.getRoomByUserId(userId);

    if (room) {
      const response = room.removeTeamAndRole(userId);

      if (response) {
        const { team, role } = response;
        const roomIds = room.getPlayerIds();
        return { team, role, roomIds };
      }
    }
  }
}

export function getRoomManager(): RoomManager {
  const roomManager = new RoomManager();
  return roomManager;
}
