import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorPage } from './ErrorPage';
import userEvent from '@testing-library/user-event';

const mockNavigate = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

describe('ErrorPage', () => {
  it('render header', () => {
    render(<ErrorPage />);
    expect(screen.getByRole('error-title')).toBeInTheDocument();
  });

  it('calls navigate(-1) when you click on Back', async () => {
    const user = userEvent.setup();

    render(<ErrorPage />);

    const button = screen.getByRole('button', { name: /назад|back/i });

    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
