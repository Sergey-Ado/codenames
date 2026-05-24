import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { TypedSocket } from '@/types/general.types';
import { RoomPreview } from '@repo/shared/room';
import { LobbyPage } from './LobbyPage';

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();
let mockSocket: Partial<TypedSocket>;
const roomPreviews: RoomPreview[] = [
  {
    id: 'roomId',
    name: 'roomName',
    maxCount: 4,
    currentCount: 1,
    status: 'waiting',
    players: [{ id: 'userId', username: 'username' }],
  },
];

vi.mock('./roomPreviewUi/RoomPreviewUi', () => ({
  RoomPreviewUI: ({
    roomPreview,
  }: {
    roomPreview: RoomPreview;
    socket: TypedSocket;
  }) => <div data-testid={`room-${roomPreview.id}`}>{roomPreview.name}</div>,
}));

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (fn: any) =>
    fn({
      general: {
        openSettings: false,
        userdata: { id: 'userId', username: 'username' },
        openAvatarMenu: true,
      },
    }),
}));

vi.mock('react-router', () => ({
  useLoaderData: () => ({ roomPreviews, socket: mockSocket }),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockSocket = {
    on: vi.fn(),
    off: vi.fn(),
  };
  vi.resetAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('LobbyPage', () => {
  it('should render component', async () => {
    render(<LobbyPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('must set the listener on the socket event lobby:entered-to-room', () => {
    render(<LobbyPage />);
    expect(mockSocket.on).toHaveBeenCalledWith(
      'lobby:entered-to-room',
      expect.any(Function)
    );
  });

  it('must remove the listener when unmounting', () => {
    const { unmount } = render(<LobbyPage />);
    unmount();
    expect(mockSocket.off).toHaveBeenCalledWith(
      'lobby:entered-to-room',
      expect.any(Function)
    );
  });

  it('should dispatch changeShowSpinner(false)', () => {
    render(<LobbyPage />);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('changeShowSpinner'),
      })
    );
  });

  it('should dispatch changeUserdata with id and username', async () => {
    const { LobbyPage } = await import('./LobbyPage');

    render(<LobbyPage />);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: { id: 'userId', username: 'username' },
      })
    );
  });

  it('should navigate to /room when an event is received for the current user', async () => {
    render(<LobbyPage />);

    const callback = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'lobby:entered-to-room'
    )?.[1];

    expect(callback).toBeDefined();
    callback({ userId: 'userId' });
    expect(mockNavigate).toHaveBeenCalledWith('/room');
  });

  it('should not navigate if userId does not match', async () => {
    const { LobbyPage } = await import('./LobbyPage');
    render(<LobbyPage />);

    const callback = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'lobby:entered-to-room'
    )?.[1];

    callback({ userId: 'anotherUserId' });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should render multiple Avatar components for multiple players', () => {
    render(<LobbyPage />);

    expect(screen.getByTestId('room-roomId')).toBeInTheDocument();
  });

  it('should not dispatch changeUserdata if there is no id', async () => {
    vi.resetModules();

    vi.doMock('react-redux', () => ({
      useDispatch: () => mockDispatch,
      useSelector: (fn: any) =>
        fn({
          general: {
            openSettings: false,
            userdata: { id: undefined, username: 'username' },
            openAvatarMenu: true,
          },
        }),
    }));

    vi.doMock('react-router', () => ({
      useLoaderData: () => ({ roomPreviews, socket: mockSocket }),
      useNavigate: () => mockNavigate,
    }));

    const { LobbyPage: LobbyPageComponent } = await import('./LobbyPage');
    render(<LobbyPageComponent />);

    const calls = mockDispatch.mock.calls;
    const changeUserdataCalls = calls.filter(
      (call: any) =>
        call[0].payload?.id !== undefined &&
        call[0].payload?.username !== undefined
    );
    expect(changeUserdataCalls.length).toBe(0);
  });
});
