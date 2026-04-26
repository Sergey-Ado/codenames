import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Welcome } from '../../../app2/pages/welcome/Welcome';

describe('Welcome', () => {
  it('render headers', () => {
    render(<Welcome />);
    expect(screen.getByText(/^codenames$/i)).toBeInTheDocument();
  });

  it('calls onLoginClick when you click on LOGIN', async () => {
    const user = userEvent.setup();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<Welcome />);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.click(loginButton);
    expect(spy).toHaveBeenCalledWith('login');

    spy.mockRestore();
  });

  it('calls onRegisterClick when you click on REGISTER', async () => {
    const user = userEvent.setup();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<Welcome />);
    const registerButton = screen.getByRole('button', { name: /register/i });

    await user.click(registerButton);
    expect(spy).toHaveBeenLastCalledWith('register');

    spy.mockRestore();
  });
});
