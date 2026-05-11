import { Pages, StorageConstants } from '@/types/general.types';
import { MiddlewareFunction, redirect } from 'react-router';
import { socket } from './router';

export const routerMiddleware: MiddlewareFunction = async ({ request }) => {
  const protectedPages = new Set([Pages.LOBBY].map(String));

  const authToken = sessionStorage.getItem(StorageConstants.AUTH_TOKEN);
  const urlEnd = request.url.split('/').at(-1) || '';

  if (authToken) {
    if (!protectedPages.has(urlEnd)) {
      throw redirect(`/${Pages.LOBBY}`);
    }

    await new Promise((res, rej) => {
      socket.auth = { authToken };
      socket.disconnect().connect();

      const connectListener = () => {
        socket.off('connect', connectListener);
        res('Ok');
      };

      const connectErrorListener = () => {
        socket.off('connect_error', connectErrorListener);
        rej();
      };

      socket.on('connect', connectListener);
      socket.on('connect_error', connectErrorListener);
    }).then(console.log, () => {
      sessionStorage.removeItem(StorageConstants.AUTH_TOKEN);
      sessionStorage.removeItem(StorageConstants.USER_ID);
      sessionStorage.removeItem(StorageConstants.USERNAME);

      throw redirect(`/${Pages.LOBBY}`);
    });
  } else {
    if (protectedPages.has(urlEnd)) {
      throw redirect(`/${Pages.LOGIN}`);
    }
  }
};
