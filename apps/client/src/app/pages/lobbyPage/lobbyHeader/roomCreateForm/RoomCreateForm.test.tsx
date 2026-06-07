import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockCallback = vi.fn();
const mockGenerate = vi.fn();

vi.mock('@/utils/generateRoomName', () => ({
  generateRoomName: mockGenerate,
}));

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('RoomCreateForm', () => {
  it('should be rendered', async () => {
    const { RoomCreateForm } = await import('./RoomCreateForm');

    render(<RoomCreateForm callback={mockCallback} />);

    const submit = screen.queryByRole('submit');
    const generate = screen.queryByRole('generate');

    expect(submit).toBeInTheDocument();
    expect(generate).toBeInTheDocument();
  });

  it('should call generateRoomName when click generate button', async () => {
    const { RoomCreateForm } = await import('./RoomCreateForm');

    render(<RoomCreateForm callback={mockCallback} />);

    const generate = screen.getByRole('generate');

    fireEvent.click(generate);

    expect(mockGenerate).toHaveBeenCalledTimes(1);
  });

  it('should call console and callback when click submit button and valid data', async () => {
    const { RoomCreateForm } = await import('./RoomCreateForm');

    render(<RoomCreateForm callback={mockCallback} />);

    const submit = screen.getByRole('submit');
    const inputName = screen.getByRole('input-name');

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const user = userEvent.setup();

    await user.type(inputName, 'new-room');
    await user.click(submit);

    expect(mockCallback).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledOnce();

    spy.mockRestore();
  });

  it('should show error message when click submit button and invalid data', async () => {
    const { RoomCreateForm } = await import('./RoomCreateForm');

    render(<RoomCreateForm callback={mockCallback} />);

    const submit = screen.getByRole('submit');

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    fireEvent.click(submit);

    await waitFor(() => {
      expect(mockCallback).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
      expect(screen.getByRole('invalid-name')).toBeInTheDocument();
    });

    spy.mockRestore();
  });
});
