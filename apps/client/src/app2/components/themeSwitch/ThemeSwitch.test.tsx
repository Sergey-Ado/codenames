import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemeSwitch } from './ThemeSwitch';

describe('ThemeSwitch', () => {
  it('change theme when you click on the switch', async () => {
    const user = userEvent.setup();

    render(<ThemeSwitch />);

    expect(document.documentElement.classList.contains('dark')).toBeFalsy();

    await user.click(screen.getByRole('switch-dark'));

    expect(document.documentElement.classList.contains('dark')).toBeTruthy();

    await user.click(screen.getByRole('switch-light'));

    expect(document.documentElement.classList.contains('dark')).toBeFalsy();
  });
});
