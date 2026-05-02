import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Logo } from './Logo';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { Pages } from '../../../../types/general.types';

function setWindowWidth(width: number) {
  globalThis.innerWidth = width;
  globalThis.dispatchEvent(new Event('resize'));
}

function renderWithRouter(ui: ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('Logo', () => {
  beforeEach(() => {
    setWindowWidth(800);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('calls link to Welcome page when click logo', () => {
    renderWithRouter(<Logo />);

    const link = screen.getByRole('logo').closest('a');
    expect(link).toBeInTheDocument();

    expect(link?.getAttribute('href')).toBe(Pages.WELCOME);
  });

  it('displays "codename" when the width is >= 460px', () => {
    setWindowWidth(800);
    renderWithRouter(<Logo />);
    expect(screen.getByRole('logo')).toHaveTextContent('codenames');
  });

  it('displays "cn" when the width is < 460px', () => {
    setWindowWidth(450);

    renderWithRouter(<Logo />);
    const element = screen.getByRole('logo');

    expect(element).toHaveTextContent('cn');
  });
});
