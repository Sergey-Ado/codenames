import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorPage } from './ErrorPage';
import userEvent from '@testing-library/user-event';

describe('ErrorPage', () => {
  it('render header', () => {
    render(<ErrorPage />);
    expect(screen.getByRole('error-title')).toBeInTheDocument();
  });

  it('calls handleBack when you click on Back', async () => {
    const user = userEvent.setup();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<ErrorPage />);
    const button = screen.getByRole('button', { name: /назад|back/i });

    await user.click(button);
    expect(spy).toHaveBeenCalledWith('back');

    spy.mockRestore();
  });
});
