import express from 'express';
import type { Request, Response } from 'express';
import { userData } from './userData.ts';
import { HttpStatus } from '@repo/shared/api';
import { getUserWithoutPassword } from '../utils/getUserWithoutPassword.ts';

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

const userRouter = express.Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);

export { userRouter };
