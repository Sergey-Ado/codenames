import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './Header';
import userEvent from '@testing-library/user-event';

function renderWithRouter(ui: ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

const mockDispatch = vi.fn();

vi.mock('react-redux', () => ({
  useSelector: (fn: any) =>
    fn({
      general: {
        userdata: { id: 'userId', username: 'username' },
      },
    }),
  useDispatch: () => mockDispatch,
}));

describe('Header', () => {
  it('rendered', () => {
    renderWithRouter(<Header />);
  });

  it('calls console when click avatar', async () => {
    renderWithRouter(<Header />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('avatar'));

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('shows avatarMenu when openAvatarMenu=true', async () => {
    vi.resetModules();
    vi.doMock('react-redux', () => ({
      useSelector: (fn: any) =>
        fn({
          general: {
            userdata: { id: 'userId', username: 'username' },
            openAvatarMenu: true,
          },
        }),
      useDispatch: () => mockDispatch,
    }));

    const { Header } = await import('./Header');
    renderWithRouter(<Header />);

    expect(screen.queryByRole('avatar-menu')).toBeInTheDocument();
  });
});
