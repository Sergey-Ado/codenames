import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UnknownTeam } from './UnknownTeam';
import { RoomState } from '@repo/shared/room';

vi.mock('@/app/components/avatar/Avatar', () => ({
  default: ({ seed, title }: { seed: string; title: string }) => (
    <div data-testid={`avatar-${seed}`} title={title}>
      Avatar {seed}
    </div>
  ),
}));

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

    render(<UnknownTeam roomState={roomState} />);

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

    render(<UnknownTeam roomState={roomState} />);

    const panel = screen.getByRole('unknown-team');
    expect(panel.children).toHaveLength(3);

    expect(screen.getByTestId('avatar-player-1')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-player-2')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-player-3')).toBeInTheDocument();
  });
});
