import { RoomPreview } from '@repo/shared/room';
import { roomPreviews } from '../data/roomPreviews.ts';
import { Room } from './room.ts';

export class RoomManager {
  private static instance: RoomManager | undefined;
  private rooms: Room[] = [];

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
}
