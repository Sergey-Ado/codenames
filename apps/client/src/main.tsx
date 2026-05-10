import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n.tsx';
import { RouterProvider } from 'react-router/dom';
import { Provider } from 'react-redux';
import store from './app/store/store.ts';
import { router } from './app/router/router.ts';

export function mainRender() {
  createRoot(document.querySelector('#root') || document.body).render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

mainRender();

export function setGlobalStyles() {
  document.documentElement.classList.add('can-dur');
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') document.documentElement.classList.add('dark');
}

setGlobalStyles();
