import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import App from '../app/App';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';

function renderWithRouter(ui: ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('App rendered', () => {
  it('', () => {
    renderWithRouter(<App />);
  });
});
