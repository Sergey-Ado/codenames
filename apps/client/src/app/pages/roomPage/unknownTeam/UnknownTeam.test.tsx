import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UnknownTeam } from './UnknownTeam';
import { RoomState } from '@repo/shared/room';
import { TypedSocket } from '@/types/general.types';

let mockSocket: Partial<TypedSocket>;
const mockEmit = vi.fn();

vi.mock('@/app/components/avatar/Avatar', () => ({
  default: ({ seed, title }: { seed: string; title: string }) => (
    <div data-testid={`avatar-${seed}`} title={title}>
      Avatar {seed}
    </div>
  ),
}));

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
    emit: mockEmit,
  };
  vi.resetAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('UnknownTeam', () => {
  it('should render component when mounted', () => {
    const roomState: RoomState = {
      id: 'roomId',
      name: 'mock-room',
      maxCount: 4,
      teams: {
        red: { spymaster: { id: '', username: '' }, operatives: [] },
        blue: { spymaster: { id: '', username: '' }, operatives: [] },
        unknown: [],
      },
    };

    render(
      <UnknownTeam roomState={roomState} socket={mockSocket as TypedSocket} />
    );

    const unknownTeam = screen.getByRole('unknown-team');

    expect(unknownTeam).toBeInTheDocument();
  });

  it('should render multiple Avatar components for multiple players', () => {
    const roomState: RoomState = {
      id: 'roomId',
      name: 'mock-room',
      maxCount: 4,
      teams: {
        red: { spymaster: { id: '', username: '' }, operatives: [] },
        blue: { spymaster: { id: '', username: '' }, operatives: [] },
        unknown: [
          { id: 'player-1', username: 'John Doe' },
          { id: 'player-2', username: 'Jane Smith' },
          { id: 'player-3', username: 'Bob Johnson' },
        ],
      },
    };

    render(
      <UnknownTeam roomState={roomState} socket={mockSocket as TypedSocket} />
    );

    const panel = screen.getByRole('unknown-team');
    expect(panel.children).toHaveLength(4);

    expect(screen.getByTestId('avatar-player-1')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-player-2')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-player-3')).toBeInTheDocument();

    const emptyCell = screen.getByRole('empty-cell');

    expect(emptyCell).toBeInTheDocument();
  });

  it('should call socket.emit when empty-cell click', () => {
    const roomState: RoomState = {
      id: 'roomId',
      name: 'mock-room',
      maxCount: 4,
      teams: {
        red: { spymaster: { id: '', username: '' }, operatives: [] },
        blue: { spymaster: { id: '', username: '' }, operatives: [] },
        unknown: [{ id: 'player-1', username: 'John Doe' }],
      },
    };

    render(
      <UnknownTeam roomState={roomState} socket={mockSocket as TypedSocket} />
    );

    const emptyCell = screen.getByRole('empty-cell');

    expect(emptyCell).toBeInTheDocument();

    fireEvent.click(emptyCell);

    expect(mockEmit).toHaveBeenCalledWith('room:add-team-and-role', {
      teamType: 'unknown',
      role: 'unknown',
    });
  });

  it('should remove player avatar when send teamType=unknown', async () => {
    const roomState: RoomState = {
      id: 'roomId',
      name: 'mock-room',
      maxCount: 4,
      teams: {
        red: { spymaster: { id: '', username: '' }, operatives: [] },
        blue: { spymaster: { id: '', username: '' }, operatives: [] },
        unknown: [
          { id: 'player-1', username: 'John Doe' },
          { id: 'player-2', username: 'Jane Smith' },
          { id: 'player-3', username: 'Bob Johnson' },
          { id: 'userId', username: 'username' },
        ],
      },
    };

    render(
      <UnknownTeam roomState={roomState} socket={mockSocket as TypedSocket} />
    );

    const callback = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'room:removed-team-and-role'
    )?.[1];

    expect(callback).toBeDefined();
    callback({ userId: 'userId', teamType: 'unknown' });

    await waitFor(() => {
      const panel = screen.getByRole('unknown-team');
      expect(panel.children).toHaveLength(4);
    });

    expect(screen.getByTestId('avatar-player-1')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-player-2')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-player-3')).toBeInTheDocument();

    expect(screen.queryByTestId('avatar-userId')).not.toBeInTheDocument();

    const emptyCell = screen.getByRole('empty-cell');

    expect(emptyCell).toBeInTheDocument();
  });

  it('should not remove player avatar when send teamType!=unknown', async () => {
    const roomState: RoomState = {
      id: 'roomId',
      name: 'mock-room',
      maxCount: 4,
      teams: {
        red: { spymaster: { id: '', username: '' }, operatives: [] },
        blue: { spymaster: { id: '', username: '' }, operatives: [] },
        unknown: [
          { id: 'player-1', username: 'John Doe' },
          { id: 'player-2', username: 'Jane Smith' },
          { id: 'player-3', username: 'Bob Johnson' },
          { id: 'userId', username: 'username' },
        ],
      },
    };

    render(
      <UnknownTeam roomState={roomState} socket={mockSocket as TypedSocket} />
    );

    const callback = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'room:removed-team-and-role'
    )?.[1];

    expect(callback).toBeDefined();
    callback({ userId: 'userId', teamType: 'operative' });

    await waitFor(() => {
      const panel = screen.getByRole('unknown-team');
      expect(panel.children).toHaveLength(4);
    });

    expect(screen.getByTestId('avatar-player-1')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-player-2')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-player-3')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-userId')).toBeInTheDocument();

    expect(screen.queryByRole('empty-cell')).not.toBeInTheDocument();
  });

  it('should add player avatar when send teamType=unknown', async () => {
    const roomState: RoomState = {
      id: 'roomId',
      name: 'mock-room',
      maxCount: 4,
      teams: {
        red: { spymaster: { id: '', username: '' }, operatives: [] },
        blue: { spymaster: { id: '', username: '' }, operatives: [] },
        unknown: [
          { id: 'player-1', username: 'John Doe' },
          { id: 'player-2', username: 'Jane Smith' },
          { id: 'player-3', username: 'Bob Johnson' },
        ],
      },
    };

    render(
      <UnknownTeam roomState={roomState} socket={mockSocket as TypedSocket} />
    );

    const callback = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'room:added-team-and-role'
    )?.[1];

    expect(callback).toBeDefined();
    callback({
      player: { id: 'userId1', username: 'username' },
      teamType: 'unknown',
    });

    await waitFor(() => {
      const panel = screen.getByRole('unknown-team');
      expect(panel.children).toHaveLength(4);
    });

    expect(screen.getByTestId('avatar-player-1')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-player-2')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-player-3')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-userId1')).toBeInTheDocument();

    const emptyCell = screen.getByRole('empty-cell');

    expect(emptyCell).toBeInTheDocument();
  });

  it('should not add player avatar when send teamType!=unknown', async () => {
    const roomState: RoomState = {
      id: 'roomId',
      name: 'mock-room',
      maxCount: 4,
      teams: {
        red: { spymaster: { id: '', username: '' }, operatives: [] },
        blue: { spymaster: { id: '', username: '' }, operatives: [] },
        unknown: [
          { id: 'player-1', username: 'John Doe' },
          { id: 'player-2', username: 'Jane Smith' },
          { id: 'player-3', username: 'Bob Johnson' },
        ],
      },
    };

    render(
      <UnknownTeam roomState={roomState} socket={mockSocket as TypedSocket} />
    );

    const callback = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'room:added-team-and-role'
    )?.[1];

    expect(callback).toBeDefined();
    callback({
      player: { id: 'userId1', username: 'username' },
      teamType: 'operative',
    });

    await waitFor(() => {
      const panel = screen.getByRole('unknown-team');
      expect(panel.children).toHaveLength(4);
    });

    expect(screen.getByTestId('avatar-player-1')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-player-2')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-player-3')).toBeInTheDocument();
    expect(screen.queryByTestId('avatar-userId1')).not.toBeInTheDocument();

    const emptyCell = screen.getByRole('empty-cell');

    expect(emptyCell).toBeInTheDocument();
  });
});
