import { HandlerData } from '../../types/types.ts';
import { getRoomManager } from '../roomManager/roomManager.ts';
import { getSender } from './sender.ts';

export function sendLobbyState(handlerData: HandlerData) {
  const { socket } = handlerData;

  return (): void => {
    const roomManager = getRoomManager();

    const roomPreviews = roomManager.getLobbyState();

    const { userId } = socket.data;

    const sender = getSender(handlerData);
    sender('lobby:send-state', { roomPreviews }, [userId]);
  };
}

export function enterToRoom(handlerData: HandlerData) {
  const { socket } = handlerData;

  return (payload: { roomId: string }): void => {
    const roomManager = getRoomManager();
    const { userId } = socket.data;

    const response = roomManager.moveFromLobbyToRoom(userId, payload.roomId);

    if (response) {
      const { userId, roomPreview, lobbyIds } = response;

      const sender = getSender(handlerData);

      sender('lobby:entered-to-room', { userId }, [userId]);

      sender('lobby:update-preview', { roomPreview }, lobbyIds);

      const player = roomPreview.players.find(player => player.id === userId);
      const room = roomManager.getRoomById(payload.roomId);
      if (player && room) {
        const roomIds = room.getPlayerIds();

        sender(
          'room:added-team-and-role',
          {
            player,
            teamType: 'unknown',
            role: 'unknown',
          },
          roomIds
        );
      }
    }
  };
}

export function leaveRoom(handleData: HandlerData) {
  const { socket } = handleData;

  return (): void => {
    const roomManager = getRoomManager();
    const { userId } = socket.data;

    const response = roomManager.moveFromRoomToLobby(userId);
    if (response) {
      const { roomPreview, lobbyIds, teamType, role, roomIds } = response;

      const sender = getSender(handleData);

      sender('lobby:left-room', { userId }, [userId]);

      sender('lobby:update-preview', { roomPreview }, lobbyIds);

      sender(
        'room:removed-team-and-role',
        {
          userId,
          teamType,
          role,
        },
        roomIds
      );
    }
  };
}
