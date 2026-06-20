import server from './app.ts';
import 'dotenv/config';
import { defaultEnv } from '@repo/shared/api';
import process from 'node:process';
import type { Server } from 'node:http';
import { getLogger } from './socket/logger/logger.ts';

const getShowLog = (): string | undefined => process.env.SHOW_LOG;

export const startServer = (
  port = process.env.PORT || defaultEnv.SERVER_PORT
): Server => {
  const logger = getLogger();
  const showLog = getShowLog();
  if (showLog === 'yes') {
    server.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } else {
    server.listen(port);
  }

  return server;
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
