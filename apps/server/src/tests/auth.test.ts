import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import express from 'express';
import authRouter from '../api/auth.ts';
import request from 'supertest';
import { Endpoints, HttpStatus } from '@repo/shared/api';

const loginData = { email: 'test@mail.com', password: 'secret1!' };
const registerData = {
  email: 'test@mail.com',
  username: 'John Doe',
  password: 'secret1!',
};

vi.mock('../lib/prisma.ts', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('argon2', () => ({
  hash: vi.fn(),
  verify: vi.fn(),
}));

vi.mock('jsonwebtoken', () => ({
  sign: vi.fn(() => 'jwt_token'),
}));

const app = express();
app.use(express.json());
app.use(authRouter);

describe('authRouter', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('login: successful login', async () => {
    const { prisma } = await import('../lib/prisma.ts');
    const argon = await import('argon2');
    (prisma.user.findUnique as Mock).mockResolvedValue({
      id: 'uuid',
      ...registerData,
    });
    (argon.verify as Mock).mockResolvedValue(true);

    const res = await request(app).post(Endpoints.LOGIN).send(loginData);

    expect(res.status).toBe(HttpStatus.OK);
    expect(res.headers['auth-token']).toBe('jwt_token');
    expect(res.body).toEqual({
      id: 'uuid',
      email: 'test@mail.com',
      username: 'John Doe',
    });
  });

  it('login: invalid body', async () => {
    const res = await request(app).post(Endpoints.LOGIN).send({});

    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('login: user is not found', async () => {
    const { prisma } = await import('../lib/prisma.ts');
    // eslint-disable-next-line unicorn/no-null
    (prisma.user.findUnique as Mock).mockResolvedValue(null);

    const res = await request(app).post(Endpoints.LOGIN).send(loginData);

    expect(res.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('login: invalid password', async () => {
    const { prisma } = await import('../lib/prisma.ts');
    const argon = await import('argon2');
    (prisma.user.findUnique as Mock).mockResolvedValue({
      id: 'u1',
      ...registerData,
    });
    (argon.verify as Mock).mockResolvedValue(false);

    const res = await request(app).post(Endpoints.LOGIN).send(loginData);

    expect(res.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('login: internal error', async () => {
    const { prisma } = await import('../lib/prisma.ts');
    (prisma.user.findUnique as Mock).mockRejectedValue(new Error('error'));

    const res = await request(app).post(Endpoints.LOGIN).send(loginData);

    expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('register: successful register', async () => {
    const { prisma } = await import('../lib/prisma.ts');
    (prisma.user.create as Mock).mockResolvedValue({
      id: 'u1',
      ...registerData,
    });

    const res = await request(app).post(Endpoints.REGISTER).send(registerData);

    expect(res.status).toBe(HttpStatus.CREATED);
    expect(res.headers['auth-token']).toBe('jwt_token');
    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'test@mail.com',
      username: 'John Doe',
    });
  });

  it('register: invalid body', async () => {
    const res = await request(app).post(Endpoints.REGISTER).send({});

    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('register: email is already busy', async () => {
    const { prisma } = await import('../lib/prisma.ts');
    (prisma.user.findUnique as Mock).mockResolvedValue(expect.any(Object));

    const res = await request(app).post(Endpoints.REGISTER).send(registerData);

    expect(res.status).toBe(HttpStatus.CONFLICT);
  });

  it('register: internal error', async () => {
    const { prisma } = await import('../lib/prisma.ts');
    (prisma.user.findUnique as Mock).mockRejectedValue(new Error('error'));

    const res = await request(app).post(Endpoints.REGISTER).send(registerData);

    expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
