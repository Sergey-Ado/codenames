import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeSwitch } from './ThemeSwitch';

describe('ThemeSwitch', () => {
  it('change theme when you click on the switch', () => {
    render(<ThemeSwitch />);

    expect(document.documentElement.classList.contains('dark')).toBeFalsy();

    fireEvent.click(screen.getByRole('switch-dark'));

    expect(document.documentElement.classList.contains('dark')).toBeTruthy();

    fireEvent.click(screen.getByRole('switch-light'));

    expect(document.documentElement.classList.contains('dark')).toBeFalsy();
  });
});
