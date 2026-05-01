import express from 'express';
import type { Request, Response } from 'express';
import { createServer } from 'node:http';
import { Endpoints } from '@repo/shared/api';

const app = express();
const server = createServer(app);

app.use(express.json());

app.get(Endpoints.BASE, (req: Request, res: Response) => {
  res.send('Hello world!');
});

export default server;
