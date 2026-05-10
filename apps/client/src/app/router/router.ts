import { Pages } from '@/types/general.types';
import { getServerUrl } from '@/utils/getServerUrl';
import { createBrowserRouter } from 'react-router';
import { io } from 'socket.io-client';
import App from '../App';
import { WelcomePage } from '../pages/welcomePage/WelcomePage';
import { LoginPage } from '../pages/loginPage/LoginPage';
import { RegisterPage } from '../pages/registerPage/RegisterPage';
import { LobbyPage } from '../pages/lobbyPage/LobbyPage';
import { ErrorPage } from '../pages/errorPage/ErrorPage';
import { routerMiddleware } from './routerMiddleware';

const serverUrl = getServerUrl();

const socket = io(serverUrl);
socket.on('connect', () => {
  console.log(socket.connected);
});

export const router = createBrowserRouter([
  {
    path: Pages.WELCOME,
    Component: App,
    children: [
      { index: true, Component: WelcomePage, middleware: [routerMiddleware] },
      {
        path: Pages.LOGIN,
        Component: LoginPage,
        middleware: [routerMiddleware],
      },
      {
        path: Pages.REGISTER,
        Component: RegisterPage,
        middleware: [routerMiddleware],
      },
      {
        path: Pages.LOBBY,
        Component: LobbyPage,
        middleware: [routerMiddleware],
      },
      {
        path: '*',
        Component: ErrorPage,
      },
    ],
  },
]);
