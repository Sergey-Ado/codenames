import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WelcomePage } from './WelcomePage';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { Pages } from '../../../types/general.types';

function renderWithRouter(ui: ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('WelcomePage', () => {
  it('render header', () => {
    renderWithRouter(<WelcomePage />);
    expect(screen.getByText(/^codenames$/i)).toBeInTheDocument();
  });

  it('calls link to Login page when you click on LOGIN', () => {
    renderWithRouter(<WelcomePage />);

    const link = screen.getByRole('login-link').closest('a');
    expect(link).toBeInTheDocument();

    expect(link?.getAttribute('href')).toBe(`/${Pages.LOGIN}`);
  });

  it('calls link to Register page when you click on REGISTER', () => {
    renderWithRouter(<WelcomePage />);

    const link = screen.getByRole('register-link').closest('a');
    expect(link).toBeInTheDocument();

    expect(link?.getAttribute('href')).toBe(`/${Pages.REGISTER}`);
  });
});
