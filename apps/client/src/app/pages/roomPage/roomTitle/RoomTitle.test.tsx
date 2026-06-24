import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoomTitle } from './RoomTitle';
import type { TypedSocket } from '@/types/general.types';
import type { RoomState } from '@repo/shared/room';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'room.exit-button': 'Exit',
        'room.title': 'Room:',
      };
      return translations[key] || key;
    },
  }),
}));

describe('RoomTitle', () => {
  let mockSocket: Partial<TypedSocket>;
  let mockRoomState: RoomState;

  beforeEach(() => {
    mockSocket = {
      emit: vi.fn(),
    };

    mockRoomState = {
      name: 'Test Room',
    } as RoomState;
  });

  it('should display the room title', () => {
    render(
      <RoomTitle socket={mockSocket as TypedSocket} roomState={mockRoomState} />
    );

    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Room: Test Room');
  });

  it('should display the exit button with the correct text', () => {
    render(
      <RoomTitle socket={mockSocket as TypedSocket} roomState={mockRoomState} />
    );

    const button = screen.getByRole('button', { name: /Exit/i });
    expect(button).toBeInTheDocument();
  });

  it('should call socket.emit when clicking the exit button', () => {
    render(
      <RoomTitle socket={mockSocket as TypedSocket} roomState={mockRoomState} />
    );

    const button = screen.getByRole('button', { name: /Exit/i });
    fireEvent.click(button);

    expect(mockSocket.emit).toHaveBeenCalledWith('lobby:leave-room');
    expect(mockSocket.emit).toHaveBeenCalledTimes(1);
  });

  it('should be displayed correctly with different room names', () => {
    const differentRoomState: RoomState = {
      name: 'Another Room',
    } as RoomState;

    render(
      <RoomTitle
        socket={mockSocket as TypedSocket}
        roomState={differentRoomState}
      />
    );

    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent('Room: Another Room');
  });

  it('should apply the correct classes to the button', () => {
    const { container } = render(
      <RoomTitle socket={mockSocket as TypedSocket} roomState={mockRoomState} />
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('button', 'normal-case', 'px-2', 'py-2');
  });
});
