import { RoomPreview, RoomState } from '@repo/shared/room';
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
    for (const room of this.rooms) {
      if (room.hasPlayer(player.id)) return UserStatus.IN_ROOM;
    }

    if (!this.lobby.hasPlayer(player.id)) {
      this.lobby.addPlayer(player);
    }

    return UserStatus.IN_LOBBY;
  }

  public getRoomById(roomId: string): Room | undefined {
    return this.rooms.find(({ id }) => id === roomId);
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
    const room = this.rooms.find(room => room.hasPlayer(userId));

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
    const room = this.rooms.find(room => room.hasPlayer(userId));
    if (room) {
      const roomState = room.getRoomState();
      return { roomState };
    }
  }
}

export function getRoomManager(): RoomManager {
  const roomManager = new RoomManager();
  return roomManager;
}
