import express from 'express';
import type { Request, Response } from 'express';
import { createServer } from 'node:http';
import { Endpoints } from '@repo/shared/api';
import { userRouter } from './api/user.ts';

const app = express();
const server = createServer(app);

app.use(express.json());

app.get(Endpoints.BASE, (req: Request, res: Response) => {
  res.send('Hello world!');
});

app.use(Endpoints.USER, userRouter);

export default server;
