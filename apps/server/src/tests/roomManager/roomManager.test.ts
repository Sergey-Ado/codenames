import { describe, expect, it, vi } from 'vitest';
import { RoomManager } from '../../socket/roomManager/roomManager.ts';
import { Room } from '../../socket/roomManager/room.ts';
import { UserStatus } from '@repo/shared/socketEvents';
import { Lobby } from '../../socket/roomManager/lobby.ts';

describe('RoomManager', () => {
  it('getLobbyState should return roomPreview list', () => {
    const roomManager = new RoomManager();

    const room1 = new Room('room1', 4);
    const room2 = new Room('room2', 4);
    roomManager['rooms'] = [room1, room2];

    const result = roomManager.getLobbyState();

    expect(result).toHaveLength(2);

    const roomPreviewNames = result.map(roomPreview => roomPreview.name);

    expect(roomPreviewNames).toEqual(['room1', 'room2']);
  });

  it('getUserStatus should return UserStatus.IN_ROOM if player is in room', () => {
    const player = { id: 'userId', username: 'username' };

    const room = new Room('room', 4);
    room['players'] = [player];

    const roomManager = new RoomManager();
    roomManager['rooms'] = [room];

    const result = roomManager.getUserStatus(player);

    expect(result).toBe(UserStatus.IN_ROOM);
  });

  it('getUserStatus should not add player to lobby and return UserStatus.IN_LOBBY if player is in lobby', () => {
    const player = { id: 'userId', username: 'username' };

    const roomManager = new RoomManager();
    roomManager['lobby']['players'] = [player];

    const spy = vi
      .spyOn(Lobby.prototype, 'addPlayer')
      .mockImplementation(() => {});

    const result = roomManager.getUserStatus(player);

    expect(result).toBe(UserStatus.IN_LOBBY);

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it('getUserStatus should add player to lobby and return UserStatus.IN_LOBBY if player is not in lobby', () => {
    const player = { id: 'userId', username: 'username' };

    const roomManager = new RoomManager();

    const spy = vi
      .spyOn(Lobby.prototype, 'addPlayer')
      .mockImplementation(() => {});

    const result = roomManager.getUserStatus(player);

    expect(result).toBe(UserStatus.IN_LOBBY);

    expect(spy).toHaveBeenCalledWith(player);

    spy.mockRestore();
  });

  it('getRoomById should return room if the room exists', () => {
    const room = new Room('room', 4);
    room['id'] = 'roomId';

    const roomManager = new RoomManager();
    roomManager['rooms'] = [room];

    const result = roomManager.getRoomById('roomId');

    expect(result).toEqual(room);
  });

  it("getRoomById should return undefined if the room don't exist", () => {
    const roomManager = new RoomManager();

    const result = roomManager.getRoomById('roomId');

    expect(result).toBeUndefined();
  });

  it('moveFromLobbyToRoom should return userId, roomPreview and lobbyPlayerIds if userId and roomId is correct', () => {
    const player = { id: 'userId', username: 'username' };
    const room = new Room('name', 4);
    room['id'] = 'roomId';

    const roomManager = new RoomManager();
    roomManager['lobby']['players'] = [player];
    roomManager['rooms'] = [room];

    const result = roomManager.moveFromLobbyToRoom('userId', 'roomId');

    expect(result).toEqual({
      userId: 'userId',
      roomPreview: expect.any(Object),
      lobbyPlayerIds: [],
    });
  });

  it('moveFromLobbyToRoom should return undefined if userId or roomId is not correct', () => {
    const player = { id: 'userId', username: 'username' };
    const room = new Room('name', 4);
    room['id'] = 'roomId';

    const roomManager = new RoomManager();
    roomManager['lobby']['players'] = [player];
    roomManager['rooms'] = [room];

    const result1 = roomManager.moveFromLobbyToRoom('invalidId', 'roomId');

    expect(result1).toBeUndefined();

    const result2 = roomManager.moveFromLobbyToRoom('userId', 'invalidId');

    expect(result1).toBeUndefined();
    expect(result2).toBeUndefined();
  });

  it('moveFromRoomToLobby should return object with data if userId is correct', () => {
    const player = { id: 'userId', username: 'username' };

    const room = new Room('name', 4);
    room['players'] = [player];

    const roomManager = new RoomManager();
    roomManager['rooms'] = [room];

    const result = roomManager.moveFromRoomToLobby('userId');

    expect(result).toEqual({
      roomPreview: expect.any(Object),
      lobbyPlayerIds: ['userId'],
      teamType: 'unknown',
      role: 'unknown',
      roomPlayerIds: [],
    });
  });

  it('moveFromRoomToLobby should return undefined if room is not found', () => {
    const roomManager = new RoomManager();

    const result = roomManager.moveFromRoomToLobby('userId');

    expect(result).toBeUndefined();
  });

  it('moveFromRoomToLobby should return undefined if room.removePlayer returned undefined', () => {
    const player = { id: 'userId', username: 'username' };

    const room = new Room('name', 4);
    room['players'] = [player];

    const roomManager = new RoomManager();
    roomManager['rooms'] = [room];

    const spy = vi
      .spyOn(Room.prototype, 'removePlayer')
      .mockImplementation(() => {});

    const result = roomManager.moveFromRoomToLobby('userId');

    expect(spy).toHaveBeenCalledWith('userId');
    expect(result).toBeUndefined();

    spy.mockRestore();
  });

  it('getRoomState should return room state if userId is correct', () => {
    const player = { id: 'userId', username: 'username' };

    const room = new Room('name', 4);
    room['players'] = [player];

    const roomManager = new RoomManager();
    roomManager['rooms'] = [room];

    const spy = vi.spyOn(Room.prototype, 'getRoomState');

    const result = roomManager.getRoomState('userId');

    expect(result).toEqual(expect.any(Object));
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it('getRoomState should return undefined if userId is not correct', () => {
    const roomManager = new RoomManager();

    const spy = vi.spyOn(Room.prototype, 'getRoomState');

    const result = roomManager.getRoomState('userId');

    expect(result).toBeUndefined();
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it('removeTeamAndRole should return object with data if userId is correct', () => {
    const player = { id: 'userId', username: 'username' };

    const room = new Room('name', 4);
    room['players'] = [player];

    const roomManager = new RoomManager();
    roomManager['rooms'] = [room];

    const spy = vi.spyOn(Room.prototype, 'removeTeamAndRole');

    const result = roomManager.removeTeamAndRole('userId');

    expect(result).toEqual({
      teamType: 'unknown',
      role: 'unknown',
      roomPlayerIds: ['userId'],
    });
    expect(spy).toHaveBeenCalledWith('userId');

    spy.mockRestore();
  });

  it('removeTeamAndRole should return undefined if userId is not correct', () => {
    const roomManager = new RoomManager();

    const spy = vi.spyOn(Room.prototype, 'removeTeamAndRole');

    const result = roomManager.removeTeamAndRole('userId');

    expect(result).toBeUndefined();
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it('addTeamAndRole should return object with data if userId is correct and room.addTeamAndRole return data', () => {
    const player = { id: 'userId', username: 'username' };

    const room = new Room('name', 4);
    room['players'] = [player];

    const roomManager = new RoomManager();
    roomManager['rooms'] = [room];

    const spy = vi
      .spyOn(Room.prototype, 'addTeamAndRole')
      .mockImplementation(() => ({
        player,
      }));

    const result = roomManager.addTeamAndRole('userId', 'unknown', 'unknown');

    expect(result).toEqual({ player, roomPlayerIds: ['userId'] });
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it('addTeamAndRole should return undefined if userId is correct and room.addTeamAndRole return undefined', () => {
    const player = { id: 'userId', username: 'username' };

    const room = new Room('name', 4);
    room['players'] = [player];

    const roomManager = new RoomManager();
    roomManager['rooms'] = [room];

    const spy = vi
      .spyOn(Room.prototype, 'addTeamAndRole')
      .mockImplementation(() => {});

    const result = roomManager.addTeamAndRole('userId', 'unknown', 'unknown');

    expect(result).toBeUndefined();
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it('addTeamAndRole should return undefined if userId is not correct', () => {
    const roomManager = new RoomManager();

    const spy = vi.spyOn(Room.prototype, 'addTeamAndRole');

    const result = roomManager.addTeamAndRole('userId', 'unknown', 'unknown');

    expect(result).toBeUndefined();
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it('canUpdateTeamAndRole should return true if userId is correct and room.canUpdateTeamAndRole return true', () => {
    const player = { id: 'userId', username: 'username' };

    const room = new Room('name', 4);
    room['players'] = [player];

    const roomManager = new RoomManager();
    roomManager['rooms'] = [room];

    const spy = vi
      .spyOn(Room.prototype, 'canUpdateTeamAndRole')
      .mockImplementation(() => true);

    const result = roomManager.canUpdateTeamAndRole(
      'userId',
      'unknown',
      'unknown'
    );

    expect(result).toBeTruthy();
    expect(spy).toHaveBeenCalledWith('userId', 'unknown', 'unknown');

    spy.mockRestore();
  });

  it('canUpdateTeamAndRole should return false if userId is correct and room.canUpdateTeamAndRole return false', () => {
    const player = { id: 'userId', username: 'username' };

    const room = new Room('name', 4);
    room['players'] = [player];

    const roomManager = new RoomManager();
    roomManager['rooms'] = [room];

    const spy = vi
      .spyOn(Room.prototype, 'canUpdateTeamAndRole')
      .mockImplementation(() => false);

    const result = roomManager.canUpdateTeamAndRole(
      'userId',
      'unknown',
      'unknown'
    );

    expect(result).toBeFalsy();
    expect(spy).toHaveBeenCalledWith('userId', 'unknown', 'unknown');

    spy.mockRestore();
  });

  it('canUpdateTeamAndRole should return false if userId is not correct', () => {
    const roomManager = new RoomManager();

    const spy = vi.spyOn(Room.prototype, 'canUpdateTeamAndRole');

    const result = roomManager.canUpdateTeamAndRole(
      'userId',
      'unknown',
      'unknown'
    );

    expect(result).toBeFalsy();
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it('createRoom should create new room with player if userId is in lobby', () => {
    const player = { id: 'userId', username: 'username' };

    const roomManager = new RoomManager();
    roomManager['lobby']['players'] = [player];

    const result = roomManager.createRoom('userId', 'name', 4);

    expect(result).toEqual({
      roomPreview: expect.any(Object),
      lobbyPlayerIds: [],
    });
    expect(roomManager['rooms']).toHaveLength(1);

    const room = roomManager['rooms'].find(room => room.hasPlayer('userId'));

    expect(room).not.toBeUndefined();
  });

  it('createRoom should return undefined if userId is not in lobby', () => {
    const roomManager = new RoomManager();

    const result = roomManager.createRoom('userId', 'name', 4);

    expect(result).toBeUndefined();
  });

  it('removeRoom should return roomId if room is empty', () => {
    const room = new Room('name', 4);
    room['id'] = 'roomId';

    const roomManager = new RoomManager();
    roomManager['rooms'] = [room];

    const result = roomManager.removeRoom('roomId');

    expect(result).toEqual({ roomId: 'roomId' });
  });

  it('removeRoom should return undefined if room is not empty', () => {
    const player = { id: 'userId', username: 'username' };

    const room = new Room('name', 4);
    room['id'] = 'roomId';
    room['players'] = [player];

    const roomManager = new RoomManager();
    roomManager['rooms'] = [room];

    const result = roomManager.removeRoom('roomId');

    expect(result).toBeUndefined();
  });

  it('removeRoom should return undefined if room is not found', () => {
    const roomManager = new RoomManager();

    const result = roomManager.removeRoom('roomId');

    expect(result).toBeUndefined();
  });

  it('searchRooms should return filtered list of roomPreview', () => {
    const room1 = new Room('roomAa', 4);
    const room2 = new Room('roomAb', 4);
    const room3 = new Room('roomBb', 4);

    const roomManager = new RoomManager();
    roomManager['rooms'] = [room1, room2, room3];

    const { roomPreviews } = roomManager.searchRooms('omA');

    const names = roomPreviews.map(roomPreview => roomPreview.name);

    expect(names).toEqual(['roomAa', 'roomAb']);
  });

  it('startGameStartTime return true if room.stateGameStartTimer returned true', () => {
    const player = { id: 'userId', username: 'username' };

    const room = new Room('', 4);
    room['players'] = [player];

    vi.spyOn(Room.prototype, 'startGameStartTimer').mockImplementation(
      () => true
    );

    const roomManager = new RoomManager();
    roomManager['rooms'] = [room];

    const result = roomManager.startGameStartTimer('userId', vi.fn());
    expect(result).toBeTruthy();
  });
});
