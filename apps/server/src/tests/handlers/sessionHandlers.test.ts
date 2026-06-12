import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  disconnect,
  sendStatus,
} from '../../socket/handlers/sessionHandlers.ts';
import { HandlerData, TypedSocket } from '../../types/types.ts';
import { RoomManager } from '../../socket/roomManager/roomManager.ts';
import { UserStatus } from '@repo/shared/socketEvents';

const mockSender = vi.fn();

const socket: Partial<TypedSocket> = {
  data: {
    userId: 'userId',
    username: 'username',
  },
};

let socketIds: Set<string>;

let handlerData: Partial<HandlerData>;

beforeEach(() => {
  socketIds = new Set(['socketId']);

  handlerData = {
    socket: socket as TypedSocket,
    roomManager: new RoomManager(),
    socketIdsMap: new Map([['userId', socketIds]]),
  };
});

vi.mock('../../socket/handlers/sender.ts', () => ({
  getSender: (): (() => void) => mockSender,
}));

describe('sendStatus', () => {
  it('should return function', () => {
    const result = sendStatus(handlerData as HandlerData);

    expect(result).toEqual(expect.any(Function));
  });

  it('should call roomManager.getUserStatus and sender', () => {
    const spy = vi
      .spyOn(RoomManager.prototype, 'getUserStatus')
      .mockImplementation(() => UserStatus.IN_LOBBY);

    const resultFunction = sendStatus(handlerData as HandlerData);

    resultFunction();

    expect(spy).toHaveBeenCalledWith({
      id: 'userId',
      username: 'username',
    });

    expect(mockSender).toHaveBeenCalledWith(
      'session:send-status',
      {
        userId: 'userId',
        userStatus: UserStatus.IN_LOBBY,
        username: 'username',
      },
      ['userId']
    );
  });
});

describe('disconnect', () => {
  it('should return function', () => {
    const result = disconnect(handlerData as HandlerData);

    expect(result).toEqual(expect.any(Function));
  });

  it('should remove socketId if it exists', () => {
    const spyMap = vi.spyOn(Map.prototype, 'get');

    const spySet = vi
      .spyOn(Set.prototype, 'delete')
      .mockImplementation(() => true);

    const resultFunction = disconnect(handlerData as HandlerData);

    resultFunction();

    expect(spyMap).toHaveBeenCalledWith('userId');
    expect(spySet).toHaveBeenCalled();

    spyMap.mockRestore();
    spySet.mockRestore();
  });

  it('should not remove socketId if it does not exist', () => {
    const spyMap = vi.spyOn(Map.prototype, 'get').mockImplementation(() => {});

    const spySet = vi
      .spyOn(Set.prototype, 'delete')
      .mockImplementation(() => true);

    const resultFunction = disconnect(handlerData as HandlerData);

    resultFunction();

    expect(spyMap).toHaveBeenCalledWith('userId');
    expect(spySet).not.toHaveBeenCalled();

    spyMap.mockRestore();
    spySet.mockRestore();
  });
});
