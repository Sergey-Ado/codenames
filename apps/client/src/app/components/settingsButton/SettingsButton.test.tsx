import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SettingsButton } from './SettingsButton';
import userEvent from '@testing-library/user-event';

const mockDispatch = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

describe('SettingsButton', () => {
  it('calls dispatch when click button', async () => {
    const user = userEvent.setup();

    render(<SettingsButton />);

    await user.click(screen.getByRole('settings-button'));

    expect(mockDispatch).toHaveBeenCalled();
  });
});
