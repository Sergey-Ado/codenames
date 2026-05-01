import server from "./app.js";
import 'dotenv/config';
import { envConstants } from "./types/envConstants.js";
import process from 'node:process';
const getShowLog = () => process.env.SHOW_LOG;
export const startServer = (port = process.env.PORT || envConstants.PORT) => {
    const showLog = getShowLog();
    if (showLog === 'yes') {
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
    else {
        server.listen(port);
    }
    return server;
};
if (process.env.NODE_ENV !== 'test') {
    startServer();
}
