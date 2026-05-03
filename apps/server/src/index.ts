import server from './app.ts';
import 'dotenv/config';
import { defaultEnv } from '@repo/shared/api';
import process from 'node:process';
import type { Server } from 'node:http';

const getShowLog = (): string | undefined => process.env.SHOW_LOG;

export const startServer = (
  port = process.env.PORT || defaultEnv.SERVER_PORT
): Server => {
  const showLog = getShowLog();
  if (showLog === 'yes') {
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } else {
    server.listen(port);
  }

  return server;
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
