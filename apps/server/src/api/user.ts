import express from 'express';
import type { Request, Response } from 'express';
import { userData } from './userData.ts';
import { HttpStatus } from '@repo/shared/api';
import { getUserWithoutPassword } from '../utils/getUserWithoutPassword.ts';
import { RegisterInputSchema } from '@repo/shared/user-schema';
import { v4 as uuid } from 'uuid';

const createUser = (req: Request, res: Response): void => {
  const body = RegisterInputSchema.safeParse(req.body);

  if (!body.success) {
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }

  const { email, username, password } = body.data;

  let user = userData.find(item => item.email === email);
  if (user) {
    res.sendStatus(HttpStatus.CONFLICT);
    return;
  }

  user = { id: uuid(), email, username, password };
  userData.push(user);

  const output = getUserWithoutPassword(user);
  res.status(HttpStatus.CREATED).json(output);
};

const getAllUsers = (req: Request, res: Response): void => {
  const users = userData.map(user => getUserWithoutPassword(user));
  res.json(users);
};

const getUserById = (req: Request, res: Response): void => {
  const id = req.params.id;

  if (typeof id !== 'string') {
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }

  const user = userData.find(item => item.id === id);

  if (user) {
    res.json(getUserWithoutPassword(user));
  } else {
    res.sendStatus(HttpStatus.NOT_FOUND);
  }
};

const deleteUserById = (req: Request, res: Response): void => {
  const id = req.params.id;

  if (typeof id !== 'string') {
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }

  const userIndex = userData.findIndex(item => item.id === id);

  if (userIndex === -1) {
    res.sendStatus(HttpStatus.NOT_FOUND);
  } else {
    userData.splice(userIndex, 1);
    res.sendStatus(HttpStatus.NO_CONTENT);
  }
};

const userRouter = express.Router();

userRouter.post('/', createUser);
userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.delete('/:id', deleteUserById);

export { userRouter };
