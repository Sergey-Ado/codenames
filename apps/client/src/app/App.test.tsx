import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';

function renderWithRouter(ui: ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

vi.mock('react-redux', () => ({
  useSelector: (fn: any) =>
    fn({
      general: {
        openSettings: false,
        userdata: { id: '', username: '' },
      },
    }),
  useDispatch: vi.fn(),
}));

describe('App', () => {
  it('rendered', async () => {
    const App = await import('./App');
    renderWithRouter(<App.default />);

    expect(screen.queryByRole('settings-modal')).not.toBeInTheDocument();
  });

  it('displays a modal window if openSettings=true', async () => {
    vi.resetModules();
    vi.doMock('react-redux', () => ({
      useSelector: (fn: any) =>
        fn({
          general: {
            openSettings: true,
            userdata: { id: '', username: '' },
          },
        }),
      useDispatch: vi.fn(),
    }));

    const App = await import('./App');
    renderWithRouter(<App.default />);

    expect(screen.queryByRole('settings-modal')).toBeInTheDocument();
  });
});
