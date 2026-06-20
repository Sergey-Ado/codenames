import { describe, expect, it, vi } from 'vitest';
import { initialConnected } from '../../socket/handlers/initialConnected.ts';
import { TypedServerIo, TypedSocket } from '../../types/types.ts';
import { afterEach, beforeEach } from 'node:test';

const mockUse = vi.fn();
const mockOn = vi.fn();
const mockIo: Partial<TypedServerIo> = {};
const mockSocket: Partial<TypedSocket> = {
  id: 'socketId',
  data: {
    userId: 'userId',
    username: 'username',
  },
  use: mockUse,
  on: mockOn,
};

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('initialConnected', () => {
  it('should return function', () => {
    const result = initialConnected(mockIo as TypedServerIo);

    expect(result).toEqual(expect.any(Function));
  });

  it('should call Set.add if socketIds already exist', () => {
    const spyMap = vi.spyOn(Map.prototype, 'get').mockImplementation(() => {});
    const spySet = vi.spyOn(Set.prototype, 'add');

    const onConnection = initialConnected(mockIo as TypedServerIo);

    onConnection(mockSocket as TypedSocket);

    expect(spyMap).toHaveBeenCalled();
    expect(spySet).toHaveBeenCalledWith('socketId');

    spyMap.mockRestore();
    spySet.mockRestore();
  });

  it('should call Set.add if socketIds already exist', () => {
    const spyMap = vi
      .spyOn(Map.prototype, 'get')
      .mockImplementation(() => new Set());
    const spySet = vi.spyOn(Set.prototype, 'add');

    const onConnection = initialConnected(mockIo as TypedServerIo);

    onConnection(mockSocket as TypedSocket);

    expect(spyMap).toHaveBeenCalled();
    expect(spySet).toHaveBeenCalledWith('socketId');

    spyMap.mockRestore();
    spySet.mockRestore();
  });

  it('set handlers', () => {
    const onConnection = initialConnected(mockIo as TypedServerIo);

    onConnection(mockSocket as TypedSocket);

    expect(mockOn).toHaveBeenCalledWith(
      'session:ask-status',
      expect.any(Function)
    );
    expect(mockOn).toHaveBeenCalledWith('disconnect', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith(
      'lobby:ask-state',
      expect.any(Function)
    );
    expect(mockOn).toHaveBeenCalledWith(
      'lobby:enter-to-room',
      expect.any(Function)
    );
    expect(mockOn).toHaveBeenCalledWith(
      'lobby:leave-room',
      expect.any(Function)
    );
    expect(mockOn).toHaveBeenCalledWith(
      'lobby:create-room',
      expect.any(Function)
    );
    expect(mockOn).toHaveBeenCalledWith(
      'lobby:search-rooms',
      expect.any(Function)
    );
    expect(mockOn).toHaveBeenCalledWith('room:ask-state', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith(
      'room:add-team-and-role',
      expect.any(Function)
    );
  });
});
