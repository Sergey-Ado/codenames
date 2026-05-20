import { HandlerData } from '../../types/types.ts';
import { getRoomManager } from '../roomManager/roomManager.ts';
import { getSender } from './sender.ts';

export function sendStatus(handleData: HandlerData) {
  const { socket } = handleData;

  return (): void => {
    const { userId, username } = socket.data;
    const roomManager = getRoomManager();

    const userStatus = roomManager.getUserStatus({ id: userId, username });

    const sender = getSender(handleData);

    sender('session:send-status', { userId, username, userStatus }, [userId]);
  };
}

export function disconnect(handlerData: HandlerData) {
  const { socket, socketIdsMap } = handlerData;
  const { userId } = socket.data;

  return (): void => {
    const socketIds = socketIdsMap.get(userId);

    if (socketIds) {
      socketIds.delete(socket.id);
    }
  };
}
