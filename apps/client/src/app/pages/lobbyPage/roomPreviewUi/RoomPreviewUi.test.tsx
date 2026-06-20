import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RoomPreviewUI } from './RoomPreviewUi';
import { RoomPreview } from '@repo/shared/room';
import { TypedSocket } from '@/types/general.types';

let mockSocket: Partial<TypedSocket>;
const mockEmit = vi.fn();
const mockSetRoomPreview = vi.fn();
const mockI18next = vi.fn();
const roomPreview: RoomPreview = {
  id: 'roomId',
  name: 'roomName',
  maxCount: 4,
  currentCount: 1,
  status: 'waiting',
  players: [
    {
      id: 'userId',
      username: 'username',
    },
  ],
};

vi.mock('react', async importOriginal => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useState: (roomPreview: RoomPreview) => [roomPreview, mockSetRoomPreview],
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockI18next,
  }),
}));

beforeEach(() => {
  mockSocket = {
    on: vi.fn(),
    off: vi.fn(),
    emit: mockEmit,
  };
  vi.resetAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('RoomPreview', () => {
  it('should render component', () => {
    render(
      <RoomPreviewUI
        roomPreview={roomPreview}
        socket={mockSocket as TypedSocket}
      />
    );
  });

  it('should call socket.emit if button click', () => {
    render(
      <RoomPreviewUI
        roomPreview={roomPreview}
        socket={mockSocket as TypedSocket}
      />
    );

    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(mockEmit).toHaveBeenCalled();
  });

  it('should call setRoomPreview when an event is received for the current user', () => {
    const newRoomPreview = { ...roomPreview };

    render(
      <RoomPreviewUI
        roomPreview={roomPreview}
        socket={mockSocket as TypedSocket}
      />
    );

    const callback = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'lobby:update-preview'
    )?.[1];

    expect(callback).toBeDefined();
    callback({ roomPreview: newRoomPreview });
    expect(mockSetRoomPreview).toHaveBeenCalledWith(newRoomPreview);
  });

  it('should not call setRoomPreview if userId does not match', () => {
    const newRoomPreview = { ...roomPreview, id: 'new-roomId' };

    render(
      <RoomPreviewUI
        roomPreview={roomPreview}
        socket={mockSocket as TypedSocket}
      />
    );

    const callback = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'lobby:update-preview'
    )?.[1];

    expect(callback).toBeDefined();
    callback({ roomPreview: newRoomPreview });
    expect(mockSetRoomPreview).not.toHaveBeenCalledWith(newRoomPreview);
  });

  it('should apply the correct CSS classes to avatar divs', () => {
    const newRoomPreview = {
      ...roomPreview,
      currentCount: 2,
      players: [
        {
          id: 'userId1',
          username: 'username1',
        },
        {
          id: 'userId2',
          username: 'username2',
        },
      ],
    };

    const { container } = render(
      <RoomPreviewUI
        roomPreview={newRoomPreview}
        socket={mockSocket as TypedSocket}
      />
    );

    const avatars = container.querySelectorAll('.preview-avatar');
    expect(avatars).toHaveLength(2);

    expect(avatars[0]).toHaveClass('-mr-3', 'hover:mr-0.5');
    expect(avatars[1]).not.toHaveClass('-mr-3', 'hover:mr-0.5');
  });

  it('should call t function of i18next with right argument', () => {
    render(
      <RoomPreviewUI
        roomPreview={roomPreview as RoomPreview}
        socket={mockSocket as TypedSocket}
      />
    );

    expect(mockI18next).toHaveBeenCalledWith('lobby.status.waiting');

    const newRoomPreview = { ...roomPreview, status: 'fulled' };

    render(
      <RoomPreviewUI
        roomPreview={newRoomPreview as RoomPreview}
        socket={mockSocket as TypedSocket}
      />
    );

    expect(mockI18next).toHaveBeenCalledWith('lobby.status.fulled');
  });
});
