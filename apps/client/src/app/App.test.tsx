import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import App from '../app/App';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';

function renderWithRouter(ui: ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('App', () => {
  it('rendered', () => {
    renderWithRouter(<App />);
  });

  it('displays a modal window if openSettings=true', () => {
    vi.mock('react-redux', () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useSelector: (fn: any) => fn({ general: { openSettings: true } }),
      useDispatch: () => vi.fn(),
    }));
    renderWithRouter(<App />);
  });
});
