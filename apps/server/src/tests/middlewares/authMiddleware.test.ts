import { describe, expect, it, Mock, vi } from 'vitest';
import { authMiddleware } from '../../socket/middlewares/authMiddleware.ts';
import { afterEach, beforeEach } from 'node:test';
import { TypedSocket } from '../../types/types.ts';

const mockNext = vi.fn();
const mockInfo = vi.fn();

vi.mock('jsonwebtoken', () => ({
  __esModule: true,
  default: {
    verify: vi.fn(),
  },
}));

vi.mock('../../lib/prisma.ts', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('../../socket/logger/logger.ts', () => ({
  getLogger: vi.fn().mockImplementation(() => ({
    info: mockInfo,
  })),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('authMiddleware', () => {
  it('should write userId and username to socket object and call next', async () => {
    const handshake: any = {
      auth: {
        authToken: 'fakeToken',
      },
    };

    const socket: Partial<TypedSocket> = {
      handshake,
      data: {
        userId: '',
        username: '',
      },
    };

    const jwt = await import('jsonwebtoken');
    (jwt.default.verify as Mock).mockReturnValue({ userId: 'userId' });

    const { prisma } = await import('../../lib/prisma.ts');
    (prisma.user.findUnique as Mock).mockResolvedValue({
      username: 'username',
    });

    await authMiddleware(socket as TypedSocket, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(socket.data?.userId).toBe('userId');
    expect(socket.data?.username).toBe('username');
  });

  it('should write empty string to socket.data.userId if jwt.verify return string', async () => {
    const handshake: any = {
      auth: {
        authToken: 'fakeToken',
      },
    };

    const socket: Partial<TypedSocket> = {
      handshake,
      data: {
        userId: '',
        username: '',
      },
    };

    const jwt = await import('jsonwebtoken');
    (jwt.default.verify as Mock).mockReturnValue('fakeString');

    const { prisma } = await import('../../lib/prisma.ts');
    (prisma.user.findUnique as Mock).mockResolvedValue({
      username: 'username',
    });

    await authMiddleware(socket as TypedSocket, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(socket.data?.userId).toBe('');
    expect(socket.data?.username).toBe('username');
  });

  it('should throw error if user is not found', async () => {
    const handshake: any = {
      auth: {
        authToken: 'fakeToken',
      },
    };

    const socket: Partial<TypedSocket> = {
      handshake,
      data: {
        userId: '',
        username: '',
      },
    };

    const jwt = await import('jsonwebtoken');
    (jwt.default.verify as Mock).mockReturnValue('fakeString');

    const { prisma } = await import('../../lib/prisma.ts');
    (prisma.user.findUnique as Mock).mockResolvedValue(false);

    await authMiddleware(socket as TypedSocket, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(mockInfo).toHaveBeenCalledWith('AUTH_REQUIRED');
  });
});
