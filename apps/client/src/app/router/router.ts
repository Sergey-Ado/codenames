import { Pages, TypedSocket } from '@/types/general.types';
import { getServerUrl } from '@/utils/getServerUrl';
import { createBrowserRouter } from 'react-router';
import { io } from 'socket.io-client';
import App from '../App';
import { WelcomePage } from '../pages/welcomePage/WelcomePage';
import { LoginPage } from '../pages/loginPage/LoginPage';
import { RegisterPage } from '../pages/registerPage/RegisterPage';
import { LobbyPage } from '../pages/lobbyPage/LobbyPage';
import { ErrorPage } from '../pages/errorPage/ErrorPage';
import { getRouterMiddleware } from './routerMiddleware';
import { RoomPage } from '../pages/roomPage/RoomPage';
import { getPageLoaders } from './pageLoaders';
import { Spinner } from '../components/spinner/Spinner';

const serverUrl = getServerUrl();

export const socket: TypedSocket = io(serverUrl, {
  autoConnect: false,
});
socket.on('connect', () => {
  console.log('connected');
});
socket.on('disconnect', () => {
  console.log('disconnected');
});

const { lobbyLoader } = getPageLoaders(socket);
const { routerMiddleware } = getRouterMiddleware(socket);

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
        loader: lobbyLoader,
        HydrateFallback: Spinner,
      },
      { path: Pages.ROOM, Component: RoomPage, middleware: [routerMiddleware] },
      {
        path: '*',
        Component: ErrorPage,
      },
    ],
  },
]);
