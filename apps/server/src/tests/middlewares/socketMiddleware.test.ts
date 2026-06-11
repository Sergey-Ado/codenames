import { describe, expect, it, vi } from 'vitest';
import { getSocketMiddleware } from '../../socket/middlewares/socketMiddleware.ts';

const mockOn = vi.fn();

vi.mock('../../socket/logger/logger.ts', () => ({
  getLogger: vi.fn().mockImplementation(() => ({
    on: mockOn,
  })),
}));

describe('getSocketMiddleware', () => {
  it('should return function', () => {
    const result = getSocketMiddleware('userId');

    expect(result).toEqual(expect.any(Function));
  });

  it('returned function must call logger and next function', () => {
    const middleware = getSocketMiddleware('userId');

    const mockNext = vi.fn();
    middleware(['event'], mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockOn).toHaveBeenCalled();
  });
});
