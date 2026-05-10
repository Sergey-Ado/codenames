import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { Endpoints, HttpStatus } from '@repo/shared/api';
import { deleteUserById, getUserById, userRouter } from '../api/user.ts';
import { prisma } from '../lib/prisma.ts';

const userData = {
  email: 'test@mail.com',
  username: 'John Doe',
  password: 'secret1!',
};

vi.mock('../lib/prisma.ts', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use(Endpoints.USER, userRouter);

describe('userRouter', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('createUser: successful create user', async () => {
    (prisma.user.create as Mock).mockResolvedValue({
      id: 'uuid',
      ...userData,
    });

    const res = await request(app).post(Endpoints.USER).send(userData);

    expect(res.status).toBe(HttpStatus.CREATED);
    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'test@mail.com',
      username: 'John Doe',
    });
  });

  it('createUser: invalid body', async () => {
    const res = await request(app).post(Endpoints.USER).send({});

    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('createUser: email is already busy', async () => {
    (prisma.user.findUnique as Mock).mockResolvedValue(expect.any(Object));

    const res = await request(app).post(Endpoints.USER).send(userData);

    expect(res.status).toBe(HttpStatus.CONFLICT);
  });

  it('createUser: internal error', async () => {
    (prisma.user.findUnique as Mock).mockRejectedValue(new Error('error'));

    const res = await request(app).post(Endpoints.USER).send(userData);

    expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('getAllUsers: successful get all users', async () => {
    (prisma.user.findMany as Mock).mockResolvedValue([
      { id: 'u1', ...userData },
    ]);

    const result = {
      id: 'u1',
      email: userData.email,
      username: userData.username,
    };

    const res = await request(app).get(Endpoints.USER);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body).toEqual([result]);
  });

  it('getAllUsers: internal error', async () => {
    const { prisma } = await import('../lib/prisma.ts');
    (prisma.user.findMany as Mock).mockRejectedValue(new Error('error'));

    const res = await request(app).get(Endpoints.USER).send(userData);

    expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('getUserById: successful get user by id', async () => {
    (prisma.user.findUnique as Mock).mockResolvedValue({
      id: 'u1',
      ...userData,
    });

    const result = {
      id: 'u1',
      email: userData.email,
      username: userData.username,
    };

    const res = await request(app).get(`${Endpoints.USER}/${'u1'}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body).toEqual(result);
  });

  it('getUserById: param.id is not string', async () => {
    const req = { params: { id: 123 } };
    const res = {
      sendStatus: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    // @ts-expect-error For getUserById
    await getUserById(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });

  it('login: user is not found', async () => {
    // eslint-disable-next-line unicorn/no-null
    (prisma.user.findUnique as Mock).mockResolvedValue(null);

    const res = await request(app).get(`${Endpoints.USER}/${'u1'}`);

    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('getUserById: internal error', async () => {
    const { prisma } = await import('../lib/prisma.ts');
    (prisma.user.findUnique as Mock).mockRejectedValue(new Error('error'));

    const res = await request(app)
      .get(`${Endpoints.USER}/${'u1'}`)
      .send(userData);

    expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('deleteUserById: successful delete user by id', async () => {
    (prisma.user.findUnique as Mock).mockResolvedValue({
      id: 'u1',
      ...userData,
    });

    (prisma.user.delete as Mock).mockResolvedValue({
      id: 'u1',
      ...userData,
    });

    const res = await request(app).delete(`${Endpoints.USER}/${'u1'}`);
    expect(res.status).toBe(HttpStatus.NO_CONTENT);
  });

  it('deleteUserById: param.id is not string', async () => {
    const req = { params: { id: 123 } };
    const res = {
      sendStatus: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    // @ts-expect-error For deleteUserById
    await deleteUserById(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });

  it('deleteUserById: user is not found', async () => {
    // eslint-disable-next-line unicorn/no-null
    (prisma.user.findUnique as Mock).mockResolvedValue(null);

    const res = await request(app).delete(`${Endpoints.USER}/${'u1'}`);

    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('deleteUserById: internal error', async () => {
    const { prisma } = await import('../lib/prisma.ts');
    (prisma.user.findUnique as Mock).mockRejectedValue(new Error('error'));

    const res = await request(app)
      .delete(`${Endpoints.USER}/${'u1'}`)
      .send(userData);

    expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
