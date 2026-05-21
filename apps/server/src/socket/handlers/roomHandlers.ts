import { HandlerData } from '../../types/types.ts';
import { getRoomManager } from '../roomManager/roomManager.ts';
import { getSender } from './sender.ts';

export function sendRoomState(handlerData: HandlerData) {
  const { socket } = handlerData;

  return (): void => {
    const { userId } = socket.data;

    const roomManager = getRoomManager();

    const response = roomManager.getRoomState(userId);

    if (response) {
      const { roomPreview } = response;
      const sender = getSender(handlerData);
      sender('room:send-state', { roomPreview }, [userId]);
    }
  };
}
