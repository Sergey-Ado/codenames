import { TypedSocket } from '@/types/general.types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let mockSocket: Partial<TypedSocket>;
const mockCallback = vi.fn();
const mockGenerate = vi.fn();
const mockEmit = vi.fn();

vi.mock('@/utils/generateRoomName', () => ({
  generateRoomName: mockGenerate,
}));

beforeEach(() => {
  mockSocket = {
    emit: mockEmit,
  };
  vi.resetAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('RoomCreateForm', () => {
  it('should be rendered', async () => {
    const { RoomCreateForm } = await import('./RoomCreateForm');

    render(
      <RoomCreateForm
        socket={mockSocket as TypedSocket}
        callback={mockCallback}
      />
    );

    const submit = screen.queryByRole('submit');
    const generate = screen.queryByRole('generate');

    expect(submit).toBeInTheDocument();
    expect(generate).toBeInTheDocument();
  });

  it('should call generateRoomName when click generate button', async () => {
    const { RoomCreateForm } = await import('./RoomCreateForm');

    render(
      <RoomCreateForm
        socket={mockSocket as TypedSocket}
        callback={mockCallback}
      />
    );

    const generate = screen.getByRole('generate');

    fireEvent.click(generate);

    expect(mockGenerate).toHaveBeenCalledTimes(1);
  });

  it('should call console and callback when click submit button and valid data', async () => {
    const { RoomCreateForm } = await import('./RoomCreateForm');

    render(
      <RoomCreateForm
        socket={mockSocket as TypedSocket}
        callback={mockCallback}
      />
    );

    const submit = screen.getByRole('submit');
    const inputName = screen.getByRole('input-name');

    const user = userEvent.setup();

    await user.type(inputName, 'new-room');
    await user.click(submit);

    expect(mockCallback).toHaveBeenCalledOnce();
    expect(mockEmit).toHaveBeenCalledOnce();
  });

  it('should show error message when click submit button and invalid data', async () => {
    const { RoomCreateForm } = await import('./RoomCreateForm');

    render(
      <RoomCreateForm
        socket={mockSocket as TypedSocket}
        callback={mockCallback}
      />
    );

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
