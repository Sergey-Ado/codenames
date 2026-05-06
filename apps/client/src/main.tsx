import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App.tsx';
import './i18n.tsx';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { LoginPage } from './app/pages/loginPage/LoginPage.tsx';
import { WelcomePage } from './app/pages/welcomePage/WelcomePage.tsx';
import { RegisterPage } from './app/pages/registerPage/RegisterPage.tsx';
import { ErrorPage } from './app/pages/errorPage/ErrorPage.tsx';
import { Pages } from './types/general.types.ts';
import { LobbyPage } from './app/pages/lobbyPage/LobbyPage.tsx';
import { Provider } from 'react-redux';
import store from './app/store/store.ts';

const router = createBrowserRouter([
  {
    path: Pages.WELCOME,
    Component: App,
    children: [
      { index: true, Component: WelcomePage },
      { path: Pages.LOGIN, Component: LoginPage },
      { path: Pages.REGISTER, Component: RegisterPage },
      { path: Pages.LOBBY, Component: LobbyPage },
      {
        path: '*',
        Component: ErrorPage,
      },
    ],
  },
]);

createRoot(document.querySelector('#root') || document.body).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

document.documentElement.classList.add('can-dur');
