import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RoomPage } from './RoomPage';
import { TypedSocket } from '@/types/general.types';
import { RoomState } from '@repo/shared/room';

const mockNavigate = vi.fn();
let mockSocket: Partial<TypedSocket>;
const roomState: RoomState = {
  id: 'roomId',
  name: 'roomName',
  maxCount: 4,
  teams: {
    red: { spymaster: null, operatives: [] },
    blue: { spymaster: null, operatives: [] },
    unknown: [{ id: 'userId', username: 'username' }],
  },
};

vi.mock('react-router', () => ({
  useLoaderData: () => ({ roomState, socket: mockSocket }),
  useNavigate: () => mockNavigate,
}));

vi.mock('@/app/store/store', () => {
  return {
    default: {
      getState: () => ({
        general: {
          userdata: {
            id: 'userId',
            username: 'username',
          },
          openAvatarMenu: false,
          showSpinner: false,
          openSettings: false,
        },
      }),
    },
  };
});

vi.mock('react-redux', () => ({
  useSelector: (fn: any) =>
    fn({
      general: {
        userdata: { id: 'userId', username: 'username' },
      },
    }),
  useDispatch: () => vi.fn(),
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

describe('RoomPage', () => {
  it('should render component', () => {
    render(<RoomPage />);

    const main = screen.getByRole('main');

    expect(main).toBeInTheDocument();
  });

  it('should navigate to /lobby when an event is received for the current user', async () => {
    render(<RoomPage />);

    const callback = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'lobby:left-room'
    )?.[1];

    expect(callback).toBeDefined();
    callback({ userId: 'userId' });
    expect(mockNavigate).toHaveBeenCalledWith('/lobby');
  });

  it('should not navigate if userId does not match', async () => {
    render(<RoomPage />);

    const callback = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'lobby:left-room'
    )?.[1];

    expect(callback).toBeDefined();
    callback({ userId: 'error-userId' });
    expect(mockNavigate).not.toHaveBeenCalledWith('/lobby');
  });

  it('should open game start modal when send "room:started-game-start-timer"', () => {
    render(<RoomPage />);

    const callback = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'room:started-game-start-timer'
    )?.[1];

    expect(callback).toBeDefined();
    act(() => {
      callback();
    });

    const gameStartModal = screen.getByRole('game-start-modal');
    expect(gameStartModal).toBeInTheDocument();
  });

  it('should close game start modal when send "room:started-game"', () => {
    render(<RoomPage />);

    const callback1 = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'room:started-game-start-timer'
    )?.[1];
    const callback2 = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'room:started-game'
    )?.[1];

    expect(callback1).toBeDefined();
    expect(callback2).toBeDefined();
    act(() => {
      callback1();
      callback2();
    });

    const gameStartModal = screen.queryByRole('game-start-modal');
    expect(gameStartModal).not.toBeInTheDocument();
  });
});
