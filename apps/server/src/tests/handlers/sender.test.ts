import { describe, expect, it, vi } from 'vitest';
import { getSender } from '../../socket/handlers/sender.ts';
import { afterEach, beforeEach } from 'node:test';

const mockIoEmit = vi.fn();
const mockLoggerEmit = vi.fn();

const io = {
  to: (): { emit: () => void } => ({
    emit: mockIoEmit,
  }),
};

const socketIdsMap = new Map([
  ['userId1', new Set(['socketId1', 'socketId2'])],
]);

const handlerData = {
  io,
  socketIdsMap,
};

vi.mock('../../socket/logger/logger.ts', () => ({
  getLogger: (): { emit: () => void } => ({
    emit: mockLoggerEmit,
  }),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('Sender', () => {
  it('should run io.emit and logger for the userId that is in socketIdsMap', () => {
    const sender = getSender(handlerData as any);

    sender('lobby:left-room', { userId: 'userId' }, ['userId1', 'userId2']);

    expect(mockIoEmit).toHaveBeenNthCalledWith(2, 'lobby:left-room', {
      userId: 'userId',
    });

    expect(mockLoggerEmit).toHaveBeenCalledWith(
      ['userId1'],
      'lobby:left-room',
      {
        userId: 'userId',
      }
    );
  });
});
