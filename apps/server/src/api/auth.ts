import { Endpoints, HttpStatus } from '@repo/shared/api';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import {
  LoginInputSchema,
  RegisterInputSchema,
} from '@repo/shared/user-schema';
import { getUserWithoutPassword } from '../utils/getUserWithoutPassword.ts';
import jwt from 'jsonwebtoken';
import process from 'node:process';
import { defaultEnv } from '@repo/shared/api';
import { prisma } from '../lib/prisma.ts';
import * as argon from 'argon2';

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = LoginInputSchema.safeParse(req.body);

    if (!body.success) {
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    const { email, password } = body.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.sendStatus(HttpStatus.FORBIDDEN);
      return;
    }

    if (!(await argon.verify(user.password, password))) {
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

const register = async (
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

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      res.sendStatus(HttpStatus.CONFLICT);
      return;
    }

    const id = uuid();
    const hash = await argon.hash(password);
    const newUser = { id, email, username, password: hash };
    await prisma.user.create({ data: newUser });

    const secretKey = process.env.JWT_SECRET_KEY || defaultEnv.JWT_SECRET_KEY;
    const token = jwt.sign({ userId: newUser.id }, secretKey);
    res.setHeader('auth-token', token);
    res.setHeader('Access-Control-Expose-Headers', 'auth-token');
    const output = getUserWithoutPassword(newUser);
    res.status(HttpStatus.CREATED).send(output);
  } catch (error) {
    next(error);
  }
};

const authRouter = express.Router();

authRouter.post(Endpoints.LOGIN, login);
authRouter.post(Endpoints.REGISTER, register);

export default authRouter;
