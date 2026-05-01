import express from 'express';
import { createServer } from 'node:http';

const app = express();
const server = createServer(app);

export default server;
