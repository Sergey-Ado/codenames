import { Pages, StorageConstants } from '@/types/general.types';
import { MiddlewareFunction, redirect } from 'react-router';

export const routerMiddleware: MiddlewareFunction = ({ request }) => {
  const protectedPages = new Set([Pages.LOBBY].map(String));

  console.log(request.url.split('/'));
  const authToken = sessionStorage.getItem(StorageConstants.AUTH_TOKEN);
  const urlEnd = request.url.split('/').at(-1) || '';

  if (authToken) {
    if (!protectedPages.has(urlEnd)) {
      throw redirect(`/${Pages.LOBBY}`);
    }
  } else {
    if (protectedPages.has(urlEnd)) {
      throw redirect(`/${Pages.LOGIN}`);
    }
  }
};
