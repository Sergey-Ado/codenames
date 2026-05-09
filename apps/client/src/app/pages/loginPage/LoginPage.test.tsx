import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginPage } from './LoginPage';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { Pages } from '@/types/general.types';
import { HttpStatus } from '@repo/shared/api';
import { toast } from 'sonner';
import { UserOutputSchema } from '@repo/shared/user-schema';
// import { UserOutputSchema } from '@repo/shared/user-schema';

function renderWithRouter(ui: ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

vi.mock('react-redux', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSelector: (fn: any) =>
    fn({ general: { userdata: { id: 'userId', username: 'username' } } }),
  useDispatch: () => vi.fn(),
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

describe('LoginPage', () => {
  it('submits the form and calls fetch/console', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: 'test' }),
        headers: { get: vi.fn(() => 'mock-token') },
      })
    );

    // @ts-expect-error For mock fetch method
    globalThis.fetch = fetchMock;
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    renderWithRouter(<LoginPage />);
    const user = userEvent.setup();

    const inputEmail = screen.getByRole('input-email');
    const inputPassword = screen.getByRole('input-password');

    await user.type(inputEmail, 'probe@mail.com');
    await user.type(inputPassword, 'qwerty1@');

    await user.click(screen.getByRole('button'));

    expect(fetchMock).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('mock-token');

    logSpy.mockRestore();
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

    renderWithRouter(<LoginPage />);
    const user = userEvent.setup();

    const inputEmail = screen.getByRole('input-email');
    const inputPassword = screen.getByRole('input-password');

    await user.type(inputEmail, 'probe@mail.com');
    await user.type(inputPassword, 'qwerty1@');

    await user.click(screen.getByRole('button'));

    expect(fetchMock).toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();

    logSpy.mockRestore();
  });

  it('calls toast if response.status is FORBIDDEN', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: HttpStatus.FORBIDDEN,
      })
    );

    // @ts-expect-error For mock fetch method
    globalThis.fetch = fetchMock;
    const toastSpy = vi.spyOn(toast, 'error');

    renderWithRouter(<LoginPage />);
    const user = userEvent.setup();

    const inputEmail = screen.getByRole('input-email');
    const inputPassword = screen.getByRole('input-password');

    await user.type(inputEmail, 'probe@mail.com');
    await user.type(inputPassword, 'qwerty1@');

    await user.click(screen.getByRole('button'));

    expect(toastSpy).toHaveBeenCalled();

    toastSpy.mockRestore();
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

    renderWithRouter(<LoginPage />);
    const user = userEvent.setup();

    const inputEmail = screen.getByRole('input-email');
    const inputPassword = screen.getByRole('input-password');

    await user.type(inputEmail, 'probe@mail.com');
    await user.type(inputPassword, 'qwerty1@');

    await user.click(screen.getByRole('button'));

    expect(toastSpy).toHaveBeenCalled();

    zodSpy.mockRestore();
    toastSpy.mockRestore();
  });
});
