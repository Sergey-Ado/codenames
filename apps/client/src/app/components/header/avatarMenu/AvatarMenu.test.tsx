import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

const mockDispatch = vi.fn();

vi.mock('react-redux', () => ({
  useSelector: (fn: any) =>
    fn({
      general: {
        openSettings: false,
        userdata: { id: '', username: '' },
        openAvatarMenu: true,
      },
    }),
  useDispatch: () => mockDispatch,
}));

const mockNavigate = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  createBrowserRouter: vi.fn(),
}));

describe('AvatarMenu', () => {
  it('starts the transition to the Login page', async () => {
    const { AvatarMenu } = await import('./AvatarMenu');

    render(<AvatarMenu />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('avatar-menu-logout'));

    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('closes the menu when you click outside the menu', async () => {
    const { AvatarMenu } = await import('./AvatarMenu');

    render(
      <div>
        <span id="test" role="test"></span>
        <AvatarMenu />
      </div>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('test'));

    expect(mockDispatch).toHaveBeenCalled();
  });
});
