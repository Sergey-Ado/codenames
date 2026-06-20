import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  sendRoomState,
  updateTeamAndRole,
} from '../../socket/handlers/roomHandlers.ts';
import { HandlerData, TypedSocket } from '../../types/types.ts';
import { RoomManager } from '../../socket/roomManager/roomManager.ts';
import { RoomState, TypedRole, TypedTeam } from '@repo/shared/room';
import { Player } from '@repo/shared/user';

const mockSender = vi.fn();

const socket: Partial<TypedSocket> = {
  data: {
    userId: 'userId',
    username: 'username',
  },
};

const handlerData: Partial<HandlerData> = {
  socket: socket as TypedSocket,
  roomManager: new RoomManager(),
};

vi.mock('../../socket/handlers/sender.ts', () => ({
  getSender: (): (() => void) => mockSender,
}));

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('sendRoomState', () => {
  it('should return function', () => {
    const returnedFunction = sendRoomState(handlerData as HandlerData);

    expect(returnedFunction).toEqual(expect.any(Function));
  });

  it('should call sender if room state is got', () => {
    const roomState: Partial<RoomState> = {};

    const spyGetRoomState = vi
      .spyOn(RoomManager.prototype, 'getRoomState')
      .mockImplementation(() => ({
        roomState: roomState as RoomState,
      }));

    const returnedFunction = sendRoomState(handlerData as HandlerData);
    returnedFunction();

    expect(mockSender).toHaveBeenCalledWith('room:send-state', { roomState }, [
      'userId',
    ]);

    spyGetRoomState.mockRestore();
  });

  it('should not call sender if room state is not got', () => {
    const spyGetRoomState = vi
      .spyOn(RoomManager.prototype, 'getRoomState')
      .mockImplementation(() => {});

    const returnedFunction = sendRoomState(handlerData as HandlerData);
    returnedFunction();

    expect(mockSender).not.toHaveBeenCalled();

    spyGetRoomState.mockRestore();
  });
});

describe('updateTeamAndRole', () => {
  it('should return function', () => {
    const returnedFunction = updateTeamAndRole(handlerData as HandlerData);

    expect(returnedFunction).toEqual(expect.any(Function));
  });

  it('should call sender if you can change teamType and role', () => {
    const player: Player = { id: 'userId', username: 'username' };

    const payload: { teamType: TypedTeam; role: TypedRole } = {
      teamType: 'unknown',
      role: 'unknown',
    };

    const spyCan = vi
      .spyOn(RoomManager.prototype, 'canUpdateTeamAndRole')
      .mockImplementation(() => true);

    const spyRemove = vi
      .spyOn(RoomManager.prototype, 'removeTeamAndRole')
      .mockImplementation(() => ({
        teamType: 'unknown',
        role: 'unknown',
        roomIds: ['userId'],
      }));

    const spyAdd = vi
      .spyOn(RoomManager.prototype, 'addTeamAndRole')
      .mockImplementation(() => ({
        player,
        roomIds: ['userId'],
      }));

    const returnedFunction = updateTeamAndRole(handlerData as HandlerData);
    returnedFunction(payload);

    expect(mockSender).toHaveBeenCalledWith(
      'room:removed-team-and-role',
      {
        userId: 'userId',
        teamType: payload.teamType,
        role: payload.role,
      },
      ['userId']
    );

    expect(mockSender).toHaveBeenCalledWith(
      'room:added-team-and-role',
      { player, teamType: payload.teamType, role: payload.role },
      ['userId']
    );

    spyCan.mockRestore();
    spyRemove.mockRestore();
    spyAdd.mockRestore();
  });

  it('should not call sender if canUpdateTeamAndRole return false', () => {
    const payload: { teamType: TypedTeam; role: TypedRole } = {
      teamType: 'unknown',
      role: 'unknown',
    };

    const spyCan = vi
      .spyOn(RoomManager.prototype, 'canUpdateTeamAndRole')
      .mockImplementation(() => false);

    const returnedFunction = updateTeamAndRole(handlerData as HandlerData);
    returnedFunction(payload);

    expect(mockSender).not.toHaveBeenCalled();

    spyCan.mockRestore();
  });

  it('should not call sender if removeTeamAndRole return false', () => {
    const payload: { teamType: TypedTeam; role: TypedRole } = {
      teamType: 'unknown',
      role: 'unknown',
    };

    const spyCan = vi
      .spyOn(RoomManager.prototype, 'canUpdateTeamAndRole')
      .mockImplementation(() => true);

    const spyRemove = vi
      .spyOn(RoomManager.prototype, 'removeTeamAndRole')
      .mockImplementation(() => {});

    const returnedFunction = updateTeamAndRole(handlerData as HandlerData);
    returnedFunction(payload);

    spyCan.mockRestore();
    spyRemove.mockRestore();
  });
});
