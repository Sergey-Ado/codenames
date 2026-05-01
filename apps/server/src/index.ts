import server from './app.ts';
import 'dotenv/config';
import { envConstants } from './types/envConstants.ts';
import process from 'node:process';

const showLog = process.env.SHOW_LOG || envConstants.SHOW_LOG;
const port = process.env.PORT || envConstants.PORT;

if (showLog) {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
} else {
  server.listen(port);
}
