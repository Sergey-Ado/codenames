import { RoomPreview } from '@repo/shared/room';
import { roomPreviews } from '../data/roomPreviews.ts';
import { Room } from './room.ts';
import { UserStatus } from '@repo/shared/socketEvents';
import { Lobby } from './lobby.ts';
import { Player } from '@repo/shared/user';

export class RoomManager {
  private static instance: RoomManager | undefined;
  private rooms: Room[] = [];
  private lobby = new Lobby();

  public constructor() {
    if (RoomManager.instance) return RoomManager.instance;

    this.rooms = roomPreviews.map(preview => {
      const room = new Room();
      room.setData(preview);
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
}
