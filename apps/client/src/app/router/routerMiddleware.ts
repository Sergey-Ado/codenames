import { Pages, StorageConstants, TypedSocket } from '@/types/general.types';
import { MiddlewareFunction, redirect } from 'react-router';
import { ServerToClientEvents, UserStatus } from '@repo/shared/socketEvents';
import store from '../store/store';
import { changeUserdata } from '../store/generalSlice';

export const getRouterMiddleware = (socket: TypedSocket) => {
  const routerMiddleware: MiddlewareFunction = async ({ request }) => {
    const protectedPages = new Set([Pages.LOBBY, Pages.ROOM].map(String));

    const authToken = sessionStorage.getItem(StorageConstants.AUTH_TOKEN);
    const urlEnd = request.url.split('/').at(-1) || '';

    if (authToken) {
      if (!protectedPages.has(urlEnd)) {
        throw redirect(`/${Pages.LOBBY}`);
      }

      await new Promise<string>((res, rej) => {
        socket.auth = { authToken };
        socket.disconnect().connect();

        const connectListener = () => {
          socket.off('connect', connectListener);
          socket.emit('session:ask-status');
        };

        const connectErrorListener = () => {
          socket.off('connect_error', connectErrorListener);
          rej();
        };

        const sendStatusListener: ServerToClientEvents['session:send-status'] =
          ({ userId, userStatus, username }) => {
            socket.off('session:send-status', sendStatusListener);
            store.dispatch(changeUserdata({ id: userId, username }));
            res(userStatus);
          };

        socket.on('connect', connectListener);
        socket.on('connect_error', connectErrorListener);
        socket.on('session:send-status', sendStatusListener);
      }).then(
        status => {
          if (status === UserStatus.IN_LOBBY && urlEnd !== Pages.LOBBY) {
            throw redirect(`/${Pages.LOBBY}`);
          }
          if (status === UserStatus.IN_ROOM && urlEnd !== Pages.ROOM) {
            throw redirect(`/${Pages.ROOM}`);
          }
        },
        () => {
          sessionStorage.removeItem(StorageConstants.AUTH_TOKEN);
          store.dispatch(changeUserdata({ id: '', username: '' }));

          throw redirect(`/${Pages.LOBBY}`);
        }
      );
    } else {
      if (protectedPages.has(urlEnd)) {
        throw redirect(`/${Pages.LOGIN}`);
      }
    }
  };

  return { routerMiddleware };
};
