import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createRoom,
  enterToRoom,
  leaveRoom,
  sendLobbyState,
} from '../../socket/handlers/lobbyHandlers.ts';
import { HandlerData, TypedSocket } from '../../types/types.ts';
import { RoomManager } from '../../socket/roomManager/roomManager.ts';
import { RoomPreview } from '@repo/shared/room';
import { Player } from '@repo/shared/user';
import { Room } from '../../socket/roomManager/room.ts';

let handlerData: Partial<HandlerData>;
const socket: Partial<TypedSocket> = {
  data: {
    userId: 'userId',
    username: 'username',
  },
};
const mockSender = vi.fn();

vi.mock('../../socket/handlers/sender.ts', () => ({
  getSender: (): (() => void) => mockSender,
}));

beforeEach(() => {
  handlerData = {
    socket: socket as TypedSocket,
    roomManager: new RoomManager(),
  };
  vi.resetAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('sendLobbyState', () => {
  it('should return function', () => {
    const returnedFunction = sendLobbyState(handlerData as HandlerData);

    expect(returnedFunction).toEqual(expect.any(Function));
  });

  it('should call sender', () => {
    const spy = vi
      .spyOn(RoomManager.prototype, 'getLobbyState')
      .mockImplementation(() => []);

    const returnedFunction = sendLobbyState(handlerData as HandlerData);
    returnedFunction();

    expect(spy).toHaveBeenCalled();
    expect(mockSender).toHaveBeenCalledWith(
      'lobby:send-state',
      expect.any(Object),
      ['userId']
    );

    spy.mockRestore();
  });
});

describe('enterToRoom', () => {
  it('should return function', () => {
    const returnedFunction = enterToRoom(handlerData as HandlerData);

    expect(returnedFunction).toEqual(expect.any(Function));
  });

  it('should call sender if player is successfully moved from lobby to room', () => {
    const players: Player[] = [];
    const roomPreview: Partial<RoomPreview> = {
      players,
    };

    const spyMove = vi
      .spyOn(RoomManager.prototype, 'moveFromLobbyToRoom')
      .mockImplementation(() => ({
        userId: 'userId',
        roomPreview: roomPreview as RoomPreview,
        lobbyIds: [],
      }));

    const returnedFunction = enterToRoom(handlerData as HandlerData);
    returnedFunction({ roomId: 'roomId' });

    expect(spyMove).toHaveBeenCalled();
    expect(mockSender).toHaveBeenCalledWith(
      'lobby:entered-to-room',
      { userId: 'userId' },
      ['userId']
    );
    expect(mockSender).toHaveBeenCalledWith(
      'lobby:update-preview',
      { roomPreview },
      []
    );
    expect(mockSender).not.toHaveBeenCalledWith(
      'room:added-team-and-role',
      expect.any(Object),
      ['userId']
    );

    spyMove.mockRestore();
  });

  it('should not call sender if player is not moved from lobby to room', () => {
    const spyMove = vi
      .spyOn(RoomManager.prototype, 'moveFromLobbyToRoom')
      .mockImplementation(() => {});

    const returnedFunction = enterToRoom(handlerData as HandlerData);
    returnedFunction({ roomId: 'roomId' });

    expect(spyMove).toHaveBeenCalled();
    expect(mockSender).not.toHaveBeenCalled();

    spyMove.mockRestore();
  });

  it('should add teamType and role if player is in room', () => {
    const player = { id: 'userId', username: 'username' };

    const spyMove = vi
      .spyOn(RoomManager.prototype, 'moveFromLobbyToRoom')
      .mockImplementation(() => ({
        userId: 'userId',
        roomPreview: {
          players: [player],
        } as RoomPreview,
        lobbyIds: [],
      }));

    const spyGetRoom = vi
      .spyOn(RoomManager.prototype, 'getRoomById')
      .mockImplementation(() => ({ getPlayerIds: () => ['userId'] }) as Room);

    const returnedFunction = enterToRoom(handlerData as HandlerData);
    returnedFunction({ roomId: 'roomId' });

    expect(spyGetRoom).toHaveBeenCalled();
    expect(mockSender).toHaveBeenCalledWith(
      'room:added-team-and-role',
      {
        player,
        teamType: 'unknown',
        role: 'unknown',
      },
      ['userId']
    );

    spyMove.mockRestore();
    spyGetRoom.mockRestore();
  });
});

describe('leaveRoom', () => {
  it('should return function', () => {
    const returnedFunction = leaveRoom(handlerData as HandlerData);

    expect(returnedFunction).toEqual(expect.any(Function));
  });

  it('should call sender with lobby:left-room if player is removed from room', () => {
    const roomPreview: Partial<RoomPreview> = {};

    const spyMove = vi
      .spyOn(RoomManager.prototype, 'moveFromRoomToLobby')
      .mockImplementation(() => ({
        roomPreview: roomPreview as RoomPreview,
        lobbyIds: ['userId'],
        teamType: 'unknown',
        role: 'unknown',
        roomIds: [],
      }));

    const returnedFunction = leaveRoom(handlerData as HandlerData);
    returnedFunction();

    expect(mockSender).toHaveBeenCalledWith(
      'lobby:left-room',
      { userId: 'userId' },
      ['userId']
    );

    spyMove.mockRestore();
  });

  it('should not call sender if player is not removed from room', () => {
    const spyMove = vi
      .spyOn(RoomManager.prototype, 'moveFromRoomToLobby')
      .mockImplementation(() => {});

    const returnedFunction = leaveRoom(handlerData as HandlerData);
    returnedFunction();

    expect(spyMove).toHaveBeenCalled();
    expect(mockSender).not.toHaveBeenCalled();

    spyMove.mockRestore();
  });

  it('should call sender with lobby:removed-room if room is removed', () => {
    const roomPreview: Partial<RoomPreview> = {};

    const spyMove = vi
      .spyOn(RoomManager.prototype, 'moveFromRoomToLobby')
      .mockImplementation(() => ({
        roomPreview: roomPreview as RoomPreview,
        lobbyIds: ['userId'],
        teamType: 'unknown',
        role: 'unknown',
        roomIds: [],
      }));

    const spyRemove = vi
      .spyOn(RoomManager.prototype, 'removeRoom')
      .mockImplementation(() => ({ roomId: 'roomId' }));

    const returnedFunction = leaveRoom(handlerData as HandlerData);
    returnedFunction();

    expect(mockSender).toHaveBeenCalledWith(
      'lobby:removed-room',
      { roomId: 'roomId' },
      ['userId']
    );

    expect(mockSender).not.toHaveBeenCalledWith(
      'lobby:update-preview',
      { roomPreview },
      ['userId']
    );

    expect(mockSender).not.toHaveBeenCalledWith(
      'room:removed-team-and-role',
      {
        userId: 'userId',
        teamType: 'unknown',
        role: 'unknown',
      },
      []
    );

    spyMove.mockRestore();
    spyRemove.mockRestore();
  });

  it('should call sender with lobby:update-preview and room:removed-team-and-role if room is not removed', () => {
    const roomPreview: Partial<RoomPreview> = {};

    const spyMove = vi
      .spyOn(RoomManager.prototype, 'moveFromRoomToLobby')
      .mockImplementation(() => ({
        roomPreview: roomPreview as RoomPreview,
        lobbyIds: ['userId'],
        teamType: 'unknown',
        role: 'unknown',
        roomIds: [],
      }));

    const spyRemove = vi
      .spyOn(RoomManager.prototype, 'removeRoom')
      .mockImplementation(() => {});

    const returnedFunction = leaveRoom(handlerData as HandlerData);
    returnedFunction();

    expect(mockSender).not.toHaveBeenCalledWith(
      'lobby:removed-room',
      { roomId: 'roomId' },
      ['userId']
    );

    expect(mockSender).toHaveBeenCalledWith(
      'lobby:update-preview',
      { roomPreview },
      ['userId']
    );

    expect(mockSender).toHaveBeenCalledWith(
      'room:removed-team-and-role',
      {
        userId: 'userId',
        teamType: 'unknown',
        role: 'unknown',
      },
      []
    );

    spyMove.mockRestore();
    spyRemove.mockRestore();
  });
});

describe('createRoom', () => {
  it('should return function', () => {
    const returnedFunction = createRoom(handlerData as HandlerData);

    expect(returnedFunction).toEqual(expect.any(Function));
  });

  it('should call sender if room is created', () => {
    const roomPreview: Partial<RoomPreview> = {};

    const spyCreate = vi
      .spyOn(RoomManager.prototype, 'createRoom')
      .mockImplementation(() => ({
        roomPreview: roomPreview as RoomPreview,
        lobbyIds: ['userId'],
      }));

    const returnedFunction = createRoom(handlerData as HandlerData);
    returnedFunction({ name: 'name', count: 4 });

    expect(mockSender).toHaveBeenCalledWith(
      'lobby:entered-to-room',
      { userId: 'userId' },
      ['userId']
    );

    expect(mockSender).toHaveBeenCalledWith(
      'lobby:created-room',
      { roomPreview },
      ['userId']
    );

    spyCreate.mockRestore();
  });

  it('should not call sender if room is not created', () => {
    const spyCreate = vi
      .spyOn(RoomManager.prototype, 'createRoom')
      .mockImplementation(() => {});

    const returnedFunction = createRoom(handlerData as HandlerData);
    returnedFunction({ name: 'name', count: 4 });

    expect(mockSender).not.toHaveBeenCalled();

    spyCreate.mockRestore();
  });
});
