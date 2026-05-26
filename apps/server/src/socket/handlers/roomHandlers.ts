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
      const { roomState } = response;
      const sender = getSender(handlerData);
      sender('room:send-state', { roomState }, [userId]);
    }
  };
}

export function updateTeamAndRole(handleData: HandlerData) {
  const { socket } = handleData;

  return (): void => {
    const { userId } = socket.data;

    const roomManager = getRoomManager();

    const response = roomManager.removeTeamAndRole(userId);

    if (response) {
      const { team, role, roomIds } = response;

      const sender = getSender(handleData);
      sender('room:removed-team-and-role', { userId, team, role }, roomIds);
    }
  };
}
