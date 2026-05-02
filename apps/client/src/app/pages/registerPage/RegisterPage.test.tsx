import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RegisterPage } from './RegisterPage';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { Pages } from '@/types/general.types';

function renderWithRouter(ui: ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('RegisterPage', () => {
  it('calls the console with the correct input', async () => {
    const user = userEvent.setup();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    renderWithRouter(<RegisterPage />);

    const inputEmail = screen.getByRole('input-email');
    const inputUsername = screen.getByRole('input-username');
    const inputPassword = screen.getByRole('input-password');

    await user.type(inputEmail, 'probe@mail.com');
    await user.type(inputUsername, 'John Doe');
    await user.type(inputPassword, 'qwerty1@');

    await user.click(screen.getByRole('button'));

    expect(spy).toHaveBeenCalledWith({
      email: 'probe@mail.com',
      username: 'John Doe',
      password: 'qwerty1@',
    });

    spy.mockRestore();
  });

  it('shows an error message when invalid input is entered', async () => {
    const user = userEvent.setup();

    renderWithRouter(<RegisterPage />);

    await user.click(screen.getByRole('button'));

    const emailError = screen.getByRole('email-error');
    const usernameError = screen.getByRole('username-error');
    const passwordError = screen.getByRole('password-error');

    expect(emailError).toBeTruthy();
    expect(usernameError).toBeTruthy();
    expect(passwordError).toBeTruthy();
  });

  it('calls link to Login page when click to login mock lint', () => {
    renderWithRouter(<RegisterPage />);

    const link = screen.getByRole('login-link').closest('a');
    expect(link).toBeInTheDocument();

    expect(link?.getAttribute('href')).toBe(`/${Pages.LOGIN}`);
  });
});
