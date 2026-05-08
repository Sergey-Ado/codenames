import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { SettingsModal } from './SettingsModal';

const mockDispatch = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

describe('SettingsButton', () => {
  it('calls dispatch when click button', async () => {
    const user = userEvent.setup();

    render(<SettingsModal />);

    await user.click(screen.getByRole('settings-close'));

    expect(mockDispatch).toHaveBeenCalled();
  });
});
