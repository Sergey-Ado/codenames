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
      const { userId, roomPreview, lobbyPlayerIds } = response;

      const sender = getSender(handlerData);

      sender('lobby:entered-to-room', { userId }, [userId]);

      sender('lobby:update-preview', { roomPreview }, lobbyPlayerIds);

      const player = roomPreview.players.find(player => player.id === userId);
      const room = roomManager.getRoomById(payload.roomId);
      if (player && room) {
        const roomPlayerIds = room.getPlayerIds();

        sender(
          'room:added-team-and-role',
          {
            player,
            teamType: 'unknown',
            role: 'unknown',
          },
          roomPlayerIds
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
      const { roomPreview, lobbyPlayerIds, teamType, role, roomPlayerIds } =
        moveResponse;

      const removeResponse = roomManager.removeRoom(roomPreview.id);

      const sender = getSender(handleData);

      if (removeResponse) {
        const { roomId } = removeResponse;
        sender('lobby:removed-room', { roomId }, lobbyPlayerIds);
      } else {
        sender('lobby:update-preview', { roomPreview }, lobbyPlayerIds);

        sender(
          'room:removed-team-and-role',
          {
            userId,
            teamType,
            role,
          },
          roomPlayerIds
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
      const { roomPreview, lobbyPlayerIds } = response;

      const sender = getSender(handleData);

      sender('lobby:entered-to-room', { userId }, [userId]);
      sender('lobby:created-room', { roomPreview }, lobbyPlayerIds);
    }
  };
}

export function searchRooms(handleData: HandlerData) {
  const { socket, roomManager } = handleData;

  return ({ key }: { key: string }): void => {
    const { userId } = socket.data;

    const { roomPreviews } = roomManager.searchRooms(key);

    const sender = getSender(handleData);

    sender('lobby:send-state', { roomPreviews }, [userId]);
  };
}
