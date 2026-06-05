import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SettingsModal } from './SettingsModal';

const mockDispatch = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

describe('SettingsButton', () => {
  it('calls dispatch when click button', () => {
    render(<SettingsModal />);

    fireEvent.click(screen.getByRole('settings-close'));

    expect(mockDispatch).toHaveBeenCalled();
  });
});
