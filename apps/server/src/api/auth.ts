import { Endpoints, HttpStatus } from '@repo/shared/api';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { userData } from './userData.ts';
import { v4 as uuid } from 'uuid';
import {
  LoginInputSchema,
  RegisterInputSchema,
} from '@repo/shared/user-schema';
import { getUserWithoutPassword } from '../utils/getUserWithoutPassword.ts';
import jwt from 'jsonwebtoken';
import process from 'node:process';
import { defaultEnv } from '@repo/shared/api';

const login = (req: Request, res: Response, next: NextFunction): void => {
  try {
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

    const secretKey = process.env.JWT_SECRET_KEY || defaultEnv.JWT_SECRET_KEY;
    const token = jwt.sign({ userId: user.id }, secretKey);
    res.setHeader('auth-token', token);
    res.setHeader('Access-Control-Expose-Headers', 'auth-token');
    const output = getUserWithoutPassword(user);
    res.status(HttpStatus.OK).send(output);
  } catch (error) {
    next(error);
  }
};

const register = (req: Request, res: Response, next: NextFunction): void => {
  try {
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

    const id = uuid();
    user = { id, email, username, password };
    userData.push(user);

    const secretKey = process.env.JWT_SECRET_KEY || defaultEnv.JWT_SECRET_KEY;
    const token = jwt.sign({ userId: user.id }, secretKey);
    res.setHeader('auth-token', token);
    res.setHeader('Access-Control-Expose-Headers', 'auth-token');
    const output = getUserWithoutPassword(user);
    res.status(HttpStatus.CREATED).send(output);
  } catch (error) {
    next(error);
  }
};

const authRouter = express.Router();

authRouter.post(Endpoints.LOGIN, login);
authRouter.post(Endpoints.REGISTER, register);

export default authRouter;
