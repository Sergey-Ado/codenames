import { RoomPreview } from '@repo/shared/room';
import { roomPreviews } from '../data/roomPreviews.ts';

export class RoomManager {
  private static instance: RoomManager | undefined;

  public constructor() {
    if (RoomManager.instance) return RoomManager.instance;

    RoomManager.instance = this;
  }

  public getLobbyState(): RoomPreview[] {
    return roomPreviews;
  }
}
