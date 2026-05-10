import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RegisterPage } from './RegisterPage';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { Pages } from '@/types/general.types';
import { HttpStatus } from '@repo/shared/api';
import { toast } from 'sonner';
import { UserOutputSchema } from '@repo/shared/user-schema';

function renderWithRouter(ui: ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

vi.mock('react-redux', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSelector: (fn: any) =>
    fn({ general: { userdata: { id: 'userId', username: 'username' } } }),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
  }),
}));

describe('RegisterPage', () => {
  it('submits the form and calls fetch/console', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 'userId',
            username: 'username',
            email: 'test@mail.com',
          }),
        headers: { get: vi.fn(() => 'mock-token') },
      })
    );

    // @ts-expect-error For mock fetch method
    globalThis.fetch = fetchMock;

    const user = userEvent.setup();

    renderWithRouter(<RegisterPage />);

    const inputEmail = screen.getByRole('input-email');
    const inputUsername = screen.getByRole('input-username');
    const inputPassword = screen.getByRole('input-password');

    await user.type(inputEmail, 'probe@mail.com');
    await user.type(inputUsername, 'John Doe');
    await user.type(inputPassword, 'qwerty1@');

    await user.click(screen.getByRole('button'));

    expect(fetchMock).toHaveBeenCalled();
  });

  it('does not call console.log if response.ok is false', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    // @ts-expect-error For mock fetch method
    globalThis.fetch = fetchMock;
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    renderWithRouter(<RegisterPage />);
    const user = userEvent.setup();

    const inputEmail = screen.getByRole('input-email');
    const inputUsername = screen.getByRole('input-username');
    const inputPassword = screen.getByRole('input-password');

    await user.type(inputEmail, 'probe@mail.com');
    await user.type(inputUsername, 'John Doe');
    await user.type(inputPassword, 'qwerty1@');

    await user.click(screen.getByRole('button'));

    expect(fetchMock).toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();

    logSpy.mockRestore();
  });

  it('calls console.log if response.status is CONFLICT', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: HttpStatus.CONFLICT,
      })
    );

    // @ts-expect-error For mock fetch method
    globalThis.fetch = fetchMock;
    const toastSpy = vi.spyOn(toast, 'error');

    renderWithRouter(<RegisterPage />);
    const user = userEvent.setup();

    const inputEmail = screen.getByRole('input-email');
    const inputUsername = screen.getByRole('input-username');
    const inputPassword = screen.getByRole('input-password');

    await user.type(inputEmail, 'probe@mail.com');
    await user.type(inputUsername, 'John Doe');
    await user.type(inputPassword, 'qwerty1@');

    await user.click(screen.getByRole('button'));

    expect(toastSpy).toHaveBeenCalled();

    toastSpy.mockRestore();
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

  it('shows an error message when incorrect data is received', async () => {
    const zodSpy = vi
      .spyOn(UserOutputSchema, 'safeParse')
      .mockImplementation(() => {
        throw new Error('test error');
      });

    const toastSpy = vi.spyOn(toast, 'error');

    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        headers: { get: vi.fn(() => 'mock-token') },
      })
    );

    // @ts-expect-error For mock fetch method
    globalThis.fetch = fetchMock;

    renderWithRouter(<RegisterPage />);
    const user = userEvent.setup();

    const inputEmail = screen.getByRole('input-email');
    const inputUsername = screen.getByRole('input-username');
    const inputPassword = screen.getByRole('input-password');

    await user.type(inputEmail, 'probe@mail.com');
    await user.type(inputUsername, 'John Doe');
    await user.type(inputPassword, 'qwerty1@');

    await user.click(screen.getByRole('button'));

    expect(toastSpy).toHaveBeenCalled();

    zodSpy.mockRestore();
    toastSpy.mockRestore();
  });
});
