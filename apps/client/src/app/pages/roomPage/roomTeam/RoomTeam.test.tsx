import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RoomTeam } from './RoomTeam';
import { ITeam } from '@repo/shared/room';
import { TypedSocket } from '@/types/general.types';

let mockSocket: Partial<TypedSocket>;
const mockEmit = vi.fn();

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
    emit: mockEmit,
    on: vi.fn(),
  };
});

describe('RoomTeam', () => {
  it('rendered if type = red', () => {
    const team: ITeam = {
      spymaster: { id: 'spymasterId', username: 'spymasterName' },
      operatives: [{ id: 'operativeId', username: 'operativeName' }],
    };
    render(
      <RoomTeam
        teamType="red"
        maxCount={2}
        team={team}
        socket={mockSocket as TypedSocket}
      />
    );
  });

  it('rendered if type = red', () => {
    const team: ITeam = {
      spymaster: { id: 'spymasterId', username: 'spymasterName' },
      operatives: [{ id: 'operativeId', username: 'operativeName' }],
    };
    render(
      <RoomTeam
        teamType="blue"
        maxCount={2}
        team={team}
        socket={mockSocket as TypedSocket}
      />
    );
  });

  it('should create an EmptyCell if spymaster is not set, and call console.log when the EmptyCell is clicked', () => {
    const team: ITeam = {
      spymaster: null,
      operatives: [{ id: 'operativeId', username: 'operativeName' }],
    };
    render(
      <RoomTeam
        teamType="red"
        maxCount={2}
        team={team}
        socket={mockSocket as TypedSocket}
      />
    );

    const emptyCell = screen.getByRole('empty-cell');

    expect(emptyCell).toBeInTheDocument();

    fireEvent.click(emptyCell);

    expect(mockEmit).toHaveBeenCalledWith('room:add-team-and-role', {
      teamType: 'red',
      role: 'spymaster',
    });
  });

  it('should create an EmptyCell if not all operative are set, and call console.log when clicking on the EmptyCell', () => {
    const team: ITeam = {
      spymaster: { id: 'spymasterId', username: 'spymasterName' },
      operatives: [{ id: 'operativeId', username: 'operativeName' }],
    };
    render(
      <RoomTeam
        teamType="red"
        maxCount={4}
        team={team}
        socket={mockSocket as TypedSocket}
      />
    );

    const emptyCell = screen.getByRole('empty-cell');

    expect(emptyCell).toBeInTheDocument();

    fireEvent.click(emptyCell);

    expect(mockEmit).toHaveBeenCalledWith('room:add-team-and-role', {
      teamType: 'red',
      role: 'operative',
    });
  });
});
