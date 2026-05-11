import { Pages, StorageConstants } from '@/types/general.types';
import { MiddlewareFunction, redirect } from 'react-router';
import { socket } from './router';

export const routerMiddleware: MiddlewareFunction = ({ request }) => {
  const protectedPages = new Set([Pages.LOBBY].map(String));

  const authToken = sessionStorage.getItem(StorageConstants.AUTH_TOKEN);
  const urlEnd = request.url.split('/').at(-1) || '';

  if (authToken) {
    if (!protectedPages.has(urlEnd)) {
      throw redirect(`/${Pages.LOBBY}`);
    }

    socket.on('connect_error', () => {
      sessionStorage.removeItem(StorageConstants.AUTH_TOKEN);
      sessionStorage.removeItem(StorageConstants.USER_ID);
      sessionStorage.removeItem(StorageConstants.USERNAME);
      throw redirect(`/${Pages.LOBBY}`);
    });

    if (!socket.connected) {
      socket.auth = { authToken };
      socket.connect();
    }
  } else {
    if (protectedPages.has(urlEnd)) {
      throw redirect(`/${Pages.LOGIN}`);
    }
  }
};
