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
import { Server } from 'socket.io';
import { authMiddleware } from './socket/middlewares/authMiddleware.ts';
import { initialConnected } from './socket/handlers/general.ts';

const origin = process.env.FRONTEND || defaultEnv.FRONTEND_URL;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin,
    methods: ['GET', 'POST'],
  },
});

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

io.use(authMiddleware);

const onConnection = initialConnected();

io.on('connection', onConnection);

export default server;
