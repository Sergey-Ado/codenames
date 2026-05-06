import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import App from '../app/App';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import generalReducer from '../app/store/generalSlice';

function renderWithRouterAndStore(
  ui: ReactNode,
  {
    store = configureStore({
      reducer: { general: generalReducer },
    }),
  } = {}
) {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
}

describe('App rendered', () => {
  it('', () => {
    renderWithRouterAndStore(<App />);
  });
});
