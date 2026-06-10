import { SocketIdsMap } from '../../types/types.ts';
import { mockRooms } from '../data/mockRooms.ts';
import { RoomManager } from '../roomManager/roomManager.ts';

export const initialSocketStores = (): {
  socketIdsMap: SocketIdsMap;
  roomManager: RoomManager;
} => {
  const socketIdsMap: SocketIdsMap = new Map();
  const roomManager = new RoomManager();
  roomManager.setRooms(mockRooms);

  return { socketIdsMap, roomManager };
};
