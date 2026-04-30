import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Logo } from './Logo';

function setWindowWidth(width: number) {
  globalThis.innerWidth = width;
  globalThis.dispatchEvent(new Event('resize'));
}

describe('Logo', () => {
  beforeEach(() => {
    setWindowWidth(800);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('calls the console with "logo" when click logo', async () => {
    const user = userEvent.setup();

    const spy = vi.spyOn(console, 'log');

    render(<Logo />);

    await user.click(screen.getByRole('logo'));

    expect(spy).toHaveBeenCalledWith('logo');

    spy.mockRestore();
  });

  it('displays "codename" when the width is >= 460px', () => {
    setWindowWidth(800);
    render(<Logo />);
    expect(screen.getByRole('logo')).toHaveTextContent('codenames');
  });

  it('displays "cn" when the width is < 460px', () => {
    setWindowWidth(450);

    render(<Logo />);
    const element = screen.getByRole('logo');

    expect(element).toHaveTextContent('cn');
  });
});
