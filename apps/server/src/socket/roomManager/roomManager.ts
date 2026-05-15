export class RoomManager {
  private static instance: RoomManager | undefined;

  public constructor() {
    if (RoomManager.instance) return RoomManager.instance;

    RoomManager.instance = this;
  }
}
