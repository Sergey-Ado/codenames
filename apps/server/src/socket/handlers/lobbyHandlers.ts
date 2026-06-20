import { HandlerData } from '../../types/types.ts';
import { getSender } from './sender.ts';

export function sendLobbyState(handlerData: HandlerData) {
  const { socket, roomManager } = handlerData;

  return (): void => {
    const roomPreviews = roomManager.getLobbyState();

    const { userId } = socket.data;

    const sender = getSender(handlerData);
    sender('lobby:send-state', { roomPreviews }, [userId]);
  };
}

export function enterToRoom(handlerData: HandlerData) {
  const { socket, roomManager } = handlerData;

  return (payload: { roomId: string }): void => {
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
  const { socket, roomManager } = handleData;

  return (): void => {
    const { userId } = socket.data;

    const moveResponse = roomManager.moveFromRoomToLobby(userId);

    if (moveResponse) {
      const { roomPreview, lobbyIds, teamType, role, roomIds } = moveResponse;

      const removeResponse = roomManager.removeRoom(roomPreview.id);

      const sender = getSender(handleData);

      if (removeResponse) {
        const { roomId } = removeResponse;
        sender('lobby:removed-room', { roomId }, lobbyIds);
      } else {
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

      sender('lobby:left-room', { userId }, [userId]);
    }
  };
}

export function createRoom(handleData: HandlerData) {
  const { socket, roomManager } = handleData;

  return ({ name, count }: { name: string; count: number }): void => {
    const { userId } = socket.data;

    const response = roomManager.createRoom(userId, name, count);

    if (response) {
      const { roomPreview, lobbyIds } = response;

      const sender = getSender(handleData);

      sender('lobby:entered-to-room', { userId }, [userId]);
      sender('lobby:created-room', { roomPreview }, lobbyIds);
    }
  };
}

export function searchRooms(handleData: HandlerData) {
  const { socket, roomManager } = handleData;

  return ({ key }: { key: string }): void => {
    const { userId } = socket.data;

    const response = roomManager.searchRooms(key);

    if (response) {
      const { roomPreviews } = response;

      const sender = getSender(handleData);

      sender('lobby:send-state', { roomPreviews }, [userId]);
    }
  };
}
