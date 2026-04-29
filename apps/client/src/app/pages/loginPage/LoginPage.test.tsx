import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  it('calls the console with the correct input', async () => {
    const user = userEvent.setup();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<LoginPage />);

    const inputEmail = screen.getByRole('input-email');
    const inputPassword = screen.getByRole('input-password');

    await user.type(inputEmail, 'probe@mail.com');
    await user.type(inputPassword, 'qwerty1@');

    await user.click(screen.getByRole('button'));

    expect(spy).toHaveBeenCalledWith({
      email: 'probe@mail.com',
      password: 'qwerty1@',
    });

    spy.mockRestore();
  });

  it('shows an error message when invalid input is entered', async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    await user.click(screen.getByRole('button'));

    const emailError = screen.getByRole('email-error');
    const passwordError = screen.getByRole('password-error');

    expect(emailError).toBeTruthy();
    expect(passwordError).toBeTruthy();
  });
});
