import express from 'express';
import type { Request, Response } from 'express';
import { createServer } from 'node:http';
import { defaultEnv, Endpoints } from '@repo/shared/api';
import { userRouter } from './api/user.ts';
import { errorHandler } from './api/errorHandler.ts';
import authRouter from './api/auth.ts';
import 'dotenv/config';
import process from 'node:process';
import cors from 'cors';

const origin = process.env.FRONTEND || defaultEnv.FRONTEND_URL;

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin,
    credentials: true,
  })
);

app.use(express.json());

app.get(Endpoints.BASE, (req: Request, res: Response) => {
  res.send('Hello world!');
});

app.use(Endpoints.USER, userRouter);
app.use('', authRouter);

app.use(errorHandler);

export default server;
