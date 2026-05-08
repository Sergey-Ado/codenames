import { describe, expect, it, vi } from 'vitest';
import { Header } from './Header';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ReactNode } from 'react';

function renderWithRouter(ui: ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('Header', () => {
  it('created header tag', () => {
    const header = Header();

    expect(header.type).toBe('header');
  });

  it('calls console when click avatar', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    renderWithRouter(<Header />);

    const user = userEvent.setup();

    await user.click(screen.getByRole('avatar'));

    expect(spy).toHaveBeenCalledWith('click avatar');
  });
});
