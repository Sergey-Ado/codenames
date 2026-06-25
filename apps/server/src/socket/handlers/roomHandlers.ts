import { IRoomAddTeamAddRole } from '../../types/handlerProps.ts';
import { HandlerData } from '../../types/types.ts';
import { getSender } from './sender.ts';

export function sendRoomState(handlerData: HandlerData) {
  const { socket, roomManager } = handlerData;

  return (): void => {
    const { userId } = socket.data;

    const response = roomManager.getRoomState(userId);

    if (response) {
      const { roomState } = response;
      const sender = getSender(handlerData);
      sender('room:send-state', { roomState }, [userId]);
    }
  };
}

export function updateTeamAndRole(handleData: HandlerData) {
  const { socket, roomManager } = handleData;

  return (payload: IRoomAddTeamAddRole): void => {
    const { userId } = socket.data;
    const { teamType, role } = payload;

    const canUpdate = roomManager.canUpdateTeamAndRole(userId, teamType, role);

    if (!canUpdate) return;

    const removeResponse = roomManager.removeTeamAndRole(userId);
    const addResponse = roomManager.addTeamAndRole(userId, teamType, role);

    if (removeResponse && addResponse) {
      const sender = getSender(handleData);

      const { teamType: oldTeam, role: oldRole, roomIds } = removeResponse;
      sender(
        'room:removed-team-and-role',
        { userId, teamType: oldTeam, role: oldRole },
        roomIds
      );

      const { player } = addResponse;
      sender('room:added-team-and-role', { player, teamType, role }, roomIds);

      const startGameStartCallback = (): void => {
        const response = roomManager.startGame(userId);

        if (response) {
          const { gamePlayerIds } = response;

          sender('room:started-game', null, gamePlayerIds);
        }
      };

      const response = roomManager.startGameStartTimer(
        userId,
        startGameStartCallback
      );

      if (response) {
        sender('room:started-game-start-timer', null, roomIds);
      }
    }
  };
}
