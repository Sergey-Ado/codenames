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

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: WelcomePage },
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage },
      {
        path: '*',
        Component: ErrorPage,
      },
    ],
  },
]);

createRoot(document.querySelector('#root') || document.body).render(
  <RouterProvider router={router} />
);

document.documentElement.classList.add('can-dur');
