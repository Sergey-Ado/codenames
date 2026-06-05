import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AvatarMenu } from './AvatarMenu';

const mockDispatch = vi.fn();

vi.mock('react-redux', () => ({
  useSelector: (fn: any) =>
    fn({
      general: {
        openSettings: false,
        userdata: { id: 'id', username: 'username' },
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

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('AvatarMenu', () => {
  it('starts the transition to the Login page', () => {
    render(<AvatarMenu />);

    fireEvent.click(screen.getByRole('avatar-menu-logout'));

    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('closes the menu when you click outside the menu', () => {
    render(
      <div>
        <span id="test" role="test"></span>
        <AvatarMenu />
      </div>
    );

    fireEvent.click(screen.getByRole('test'));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('open settingsModal when click settings button', () => {
    render(<AvatarMenu />);

    fireEvent.click(screen.getByRole('avatar-menu-settings'));

    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });
});
