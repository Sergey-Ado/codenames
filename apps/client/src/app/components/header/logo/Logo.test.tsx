import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Logo } from './Logo2';

describe('Logo', () => {
  it('calls the console with "logo" when click logo', async () => {
    const user = userEvent.setup();

    const spy = vi.spyOn(console, 'log');

    render(<Logo />);

    await user.click(screen.getByRole('logo'));

    expect(spy).toHaveBeenCalledWith('logo');
  });

  it('change content when change screen width', () => {});
});
