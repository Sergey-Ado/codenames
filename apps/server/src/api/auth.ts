import { Endpoints, HttpStatus } from '@repo/shared/api';
import express from 'express';
import type { Request, Response } from 'express';
import { userData } from './userData.ts';
import { LoginInputSchema } from '@repo/shared/user-schema';
import { getUserWithoutPassword } from '../utils/getUserWithoutPassword.ts';

const login = (req: Request, res: Response): void => {
  const body = LoginInputSchema.safeParse(req.body);

  if (!body.success) {
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }

  const { email, password } = body.data;

  const user = userData.find(item => item.email === email);

  if (!user) {
    res.sendStatus(HttpStatus.FORBIDDEN);
    return;
  }

  if (user.password !== password) {
    res.sendStatus(HttpStatus.FORBIDDEN);
    return;
  }

  const output = getUserWithoutPassword(user);
  res.status(HttpStatus.OK).send(output);
};

const authRouter = express.Router();

authRouter.post(Endpoints.LOGIN, login);

export default authRouter;
