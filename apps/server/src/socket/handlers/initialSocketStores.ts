import { SocketIdsMap } from '../../types/types.ts';
import { mockRooms } from '../data/mockRooms.ts';
import { RoomManager } from '../roomManager/roomManager.ts';

class SocketStores {
  private static instance: SocketStores | undefined;
  public socketIdsMap: SocketIdsMap = new Map();
  public roomManager: RoomManager = new RoomManager();

  public constructor() {
    if (SocketStores.instance) return SocketStores.instance;

    this.roomManager.setRooms(mockRooms);

    SocketStores.instance = this;
  }
}

export const initialSocketStores = (): {
  socketIdsMap: SocketIdsMap;
  roomManager: RoomManager;
} => {
  const { socketIdsMap, roomManager } = new SocketStores();

  return { socketIdsMap, roomManager };
};
