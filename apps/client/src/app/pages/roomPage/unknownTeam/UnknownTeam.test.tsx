import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UnknownTeam } from './UnknownTeam';
import { RoomState } from '@repo/shared/room';
import { TypedSocket } from '@/types/general.types';

let mockSocket: Partial<TypedSocket>;

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
    expect(panel.children).toHaveLength(3);

    expect(screen.getByTestId('avatar-player-1')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-player-2')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-player-3')).toBeInTheDocument();
  });
});
