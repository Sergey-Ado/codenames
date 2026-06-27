import {
  RoomPreview,
  RoomState,
  RoomRoleType,
  RoomTeamType,
} from '@repo/shared/room';
import { Room } from './room.ts';
import { UserStatus } from '@repo/shared/socketEvents';
import { Lobby } from './lobby.ts';
import { Player } from '@repo/shared/user';
import { MockRoom } from '../../types/types.ts';
import { EmptyCallback } from '../../types/handlerProps.ts';
import { Game } from './game.ts';

export class RoomManager {
  private lobby = new Lobby();
  private rooms: Room[] = [];
  private games: Game[] = [];

  public setRooms(mockRooms: MockRoom[]): void {
    this.rooms = mockRooms.map(mockRoom => {
      const room = new Room(mockRoom.name, mockRoom.maxCount);
      room.setData(mockRoom);
      return room;
    });
  }

  public getLobbyState(): RoomPreview[] {
    return this.rooms.map(room => room.getRoomPreview());
  }

  public getUserStatus(player: Player): UserStatus {
    if (this.getRoomByUserId(player.id)) return UserStatus.IN_ROOM;

    if (!this.lobby.hasPlayer(player.id)) {
      this.lobby.addPlayer(player);
    }

    return UserStatus.IN_LOBBY;
  }

  public getRoomById(roomId: string): Room | undefined {
    return this.rooms.find(({ id }) => id === roomId);
  }

  public getRoomByUserId(userId: string): Room | undefined {
    return this.rooms.find(room => room.hasPlayer(userId));
  }

  public moveFromLobbyToRoom(
    userId: string,
    roomId: string
  ):
    | { userId: string; roomPreview: RoomPreview; lobbyPlayerIds: string[] }
    | undefined {
    const player = this.lobby.removePlayer(userId);
    const room = this.getRoomById(roomId);

    if (player && room) {
      room.addPlayer(player);
      const userId = player.id;
      const lobbyPlayerIds = this.lobby.getPlayerIds();
      const roomPreview = room.getRoomPreview();
      return { userId, roomPreview, lobbyPlayerIds };
    }
  }

  public moveFromRoomToLobby(userId: string):
    | {
        roomPreview: RoomPreview;
        lobbyPlayerIds: string[];
        teamType: RoomTeamType;
        role: RoomRoleType;
        roomPlayerIds: string[];
      }
    | undefined {
    const room = this.getRoomByUserId(userId);

    if (room) {
      const response = room.removePlayer(userId);

      if (response) {
        const { player, teamType, role } = response;

        this.lobby.addPlayer(player);

        const roomPreview = room.getRoomPreview();
        const lobbyPlayerIds = this.lobby.getPlayerIds();
        const roomPlayerIds = room.getPlayerIds();

        return { roomPreview, lobbyPlayerIds, teamType, role, roomPlayerIds };
      }
    }
  }

  public getRoomState(userId: string): { roomState: RoomState } | undefined {
    const room = this.getRoomByUserId(userId);
    if (room) {
      const roomState = room.getRoomState();
      return { roomState };
    }
  }

  public removeTeamAndRole(
    userId: string
  ):
    | { teamType: RoomTeamType; role: RoomRoleType; roomPlayerIds: string[] }
    | undefined {
    const room = this.getRoomByUserId(userId);

    if (room) {
      const { teamType, role } = room.removeTeamAndRole(userId);
      const roomPlayerIds = room.getPlayerIds();
      return { teamType, role, roomPlayerIds };
    }
  }

  public addTeamAndRole(
    userId: string,
    teamType: RoomTeamType,
    role: RoomRoleType
  ):
    | {
        player: Player;
        roomPlayerIds: string[];
      }
    | undefined {
    const room = this.getRoomByUserId(userId);

    if (room) {
      const response = room.addTeamAndRole(userId, teamType, role);

      if (response) {
        const { player } = response;
        const roomPlayerIds = room.getPlayerIds();
        return { player, roomPlayerIds };
      }
    }
  }

  public canUpdateTeamAndRole(
    userId: string,
    teamType: RoomTeamType,
    role: RoomRoleType
  ): boolean {
    const room = this.getRoomByUserId(userId);

    if (room) {
      return room.canUpdateTeamAndRole(userId, teamType, role);
    }

    return false;
  }

  public createRoom(
    userId: string,
    name: string,
    count: number
  ):
    | {
        roomPreview: RoomPreview;
        lobbyPlayerIds: string[];
      }
    | undefined {
    const player = this.lobby.removePlayer(userId);

    if (player) {
      const room = new Room(name, count);

      room.addPlayer(player);
      this.rooms.push(room);

      const roomPreview = room.getRoomPreview();
      const lobbyPlayerIds = this.lobby.getPlayerIds();

      return { roomPreview, lobbyPlayerIds };
    }
  }

  public removeRoom(roomId: string): { roomId: string } | undefined {
    const room = this.getRoomById(roomId);

    if (room && room.getPlayerIds().length === 0) {
      this.rooms = this.rooms.filter(room => room.id !== roomId);

      return { roomId };
    }
  }

  public searchRooms(key: string): { roomPreviews: RoomPreview[] } {
    const reg = new RegExp(key, 'i');

    const roomPreviews = this.rooms
      .filter(room => reg.test(room.name))
      .map(room => room.getRoomPreview());

    return { roomPreviews };
  }

  public startGameStartTimer(userId: string, callback: EmptyCallback): boolean {
    const room = this.getRoomByUserId(userId);

    if (room && room.startGameStartTimer(callback)) {
      return true;
    }

    return false;
  }

  public startGame(userId: string): { gamePlayerIds: string[] } | undefined {
    const room = this.getRoomByUserId(userId);

    if (room) {
      const oldGame = this.games.find(game => game.getRoomId());

      if (oldGame) {
        const gamePlayerIds = oldGame.getGamePlayerIds();
        return { gamePlayerIds };
      }

      const game = new Game();

      if (game.initialGame(room)) {
        const gamePlayerIds = game.getGamePlayerIds();

        this.games.push(game);

        return { gamePlayerIds };
      }
    }
  }
}
