import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '@repo/shared/api';
import { getUserWithoutPassword } from '../utils/getUserWithoutPassword.ts';
import { RegisterInputSchema } from '@repo/shared/user-schema';
import { v4 as uuid } from 'uuid';
import { prisma } from '../lib/prisma.ts';

const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = RegisterInputSchema.safeParse(req.body);

    if (!body.success) {
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    const { email, username, password } = body.data;

    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      res.sendStatus(HttpStatus.CONFLICT);
      return;
    }

    user = { id: uuid(), email, username, password };
    await prisma.user.create({ data: user });

    const output = getUserWithoutPassword(user);
    res.status(HttpStatus.CREATED).json(output);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userList = await prisma.user.findMany();
    const users = userList.map(user => getUserWithoutPassword(user));
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== 'string') {
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (user) {
      res.json(getUserWithoutPassword(user));
    } else {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== 'string') {
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }

    await prisma.user.delete({ where: { id } });
    res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

const userRouter = express.Router();

userRouter.post('/', createUser);
userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.delete('/:id', deleteUserById);

export { userRouter };
