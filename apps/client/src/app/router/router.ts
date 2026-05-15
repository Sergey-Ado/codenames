import { Pages } from '@/types/general.types';
import { getServerUrl } from '@/utils/getServerUrl';
import { createBrowserRouter } from 'react-router';
import { io, Socket } from 'socket.io-client';
import App from '../App';
import { WelcomePage } from '../pages/welcomePage/WelcomePage';
import { LoginPage } from '../pages/loginPage/LoginPage';
import { RegisterPage } from '../pages/registerPage/RegisterPage';
import { LobbyPage } from '../pages/lobbyPage/LobbyPage';
import { ErrorPage } from '../pages/errorPage/ErrorPage';
import { routerMiddleware } from './routerMiddleware';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@repo/shared/socketEvents';
import { RoomPreview } from '@repo/shared/room';

const serverUrl = getServerUrl();

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  serverUrl,
  {
    autoConnect: false,
  }
);
socket.on('connect', () => {
  console.log('connected');
});
socket.on('disconnect', () => {
  console.log('disconnected');
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
        loader: lobbyLoader,
      },
      {
        path: '*',
        Component: ErrorPage,
      },
    ],
  },
]);

async function lobbyLoader() {
  const roomPreviews = await new Promise<RoomPreview[]>(res => {
    socket.emit('lobby:ask-state');

    socket.on('lobby:send-state', ({ roomPreviews }) => {
      res(roomPreviews);
    });
  });

  return { roomPreviews };
}
