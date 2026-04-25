import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import './i18n.tsx';

createRoot(document.querySelector('#root') || document.body).render(
  <StrictMode>
    <App />
  </StrictMode>
);
