import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoginPage } from './LoginPage';
import { Pages } from '@repo/shared/src/types/api';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';

function renderWithRouter(ui: ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('LoginPage', () => {
  it('calls the console with the correct input', async () => {
    const user = userEvent.setup();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    renderWithRouter(<LoginPage />);

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

    renderWithRouter(<LoginPage />);

    await user.click(screen.getByRole('button'));

    const emailError = screen.getByRole('email-error');
    const passwordError = screen.getByRole('password-error');

    expect(emailError).toBeTruthy();
    expect(passwordError).toBeTruthy();
  });

  it('calls link to Register page when click to register mock lint', () => {
    renderWithRouter(<LoginPage />);

    const link = screen.getByRole('register-link').closest('a');
    expect(link).toBeInTheDocument();

    expect(link?.getAttribute('href')).toBe(`/${Pages.REGISTER}`);
  });
});
