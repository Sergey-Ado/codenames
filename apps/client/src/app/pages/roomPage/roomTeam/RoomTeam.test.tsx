import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RoomTeam } from './RoomTeam';
import { ITeam } from '@repo/shared/room';
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
    emit: mockEmit,
    on: vi.fn(),
    off: vi.fn(),
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

  it('should create an EmptyCell if spymaster is not set, and call socket.emit when the EmptyCell is clicked', () => {
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

  it('should create an EmptyCell if not all operative are set, and call socket.emit when clicking on the EmptyCell', () => {
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

  it('should remove spymaster or operative avatar when send valid teamType and role', () => {
    const team: ITeam = {
      spymaster: { id: 'spymasterId', username: 'spymasterName' },
      operatives: [
        { id: 'operativeId1', username: 'operativeName1' },
        { id: 'operativeId2', username: 'operativeName2' },
      ],
    };

    render(
      <RoomTeam
        teamType="red"
        maxCount={4}
        team={team}
        socket={mockSocket as TypedSocket}
      />
    );

    expect(screen.getByTestId('avatar-spymasterId')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-operativeId1')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-operativeId2')).toBeInTheDocument();

    const callback = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'room:removed-team-and-role'
    )?.[1];

    expect(callback).toBeDefined();
    act(() => {
      callback({ userId: 'spymasterId', teamType: 'red', role: 'spymaster' });
      callback({ userId: 'operativeId1', teamType: 'red', role: 'operative' });
    });

    expect(screen.queryByTestId('avatar-spymasterId')).not.toBeInTheDocument();
    expect(screen.queryByTestId('avatar-operativeId1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('avatar-operativeId2')).toBeInTheDocument();
  });

  it('should not remove spymaster or operative avatar when send invalid teamType', () => {
    const team: ITeam = {
      spymaster: { id: 'spymasterId', username: 'spymasterName' },
      operatives: [
        { id: 'operativeId1', username: 'operativeName1' },
        { id: 'operativeId2', username: 'operativeName2' },
      ],
    };

    render(
      <RoomTeam
        teamType="red"
        maxCount={4}
        team={team}
        socket={mockSocket as TypedSocket}
      />
    );

    expect(screen.getByTestId('avatar-spymasterId')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-operativeId1')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-operativeId2')).toBeInTheDocument();

    const callback = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'room:removed-team-and-role'
    )?.[1];

    expect(callback).toBeDefined();
    act(() => {
      callback({ userId: 'spymasterId', teamType: 'blue', role: 'spymaster' });
      callback({ userId: 'operativeId1', teamType: 'blue', role: 'operative' });
    });

    expect(screen.queryByTestId('avatar-spymasterId')).toBeInTheDocument();
    expect(screen.queryByTestId('avatar-operativeId1')).toBeInTheDocument();
    expect(screen.queryByTestId('avatar-operativeId2')).toBeInTheDocument();
  });

  it('should add spymaster or operative avatar when send valid teamType and role', () => {
    const team: ITeam = {
      spymaster: null,
      operatives: [{ id: 'operativeId1', username: 'operativeName1' }],
    };

    render(
      <RoomTeam
        teamType="red"
        maxCount={4}
        team={team}
        socket={mockSocket as TypedSocket}
      />
    );

    expect(screen.queryByTestId('avatar-spymasterId')).not.toBeInTheDocument();
    expect(screen.queryByTestId('avatar-operativeId1')).toBeInTheDocument();
    expect(screen.queryByTestId('avatar-operativeId2')).not.toBeInTheDocument();

    const callback = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'room:added-team-and-role'
    )?.[1];

    expect(callback).toBeDefined();

    act(() => {
      callback({
        player: { id: 'spymasterId', username: 'spymaster' },
        teamType: 'red',
        role: 'spymaster',
      });
      callback({
        player: { id: 'operativeId2', username: 'operativeName2' },
        teamType: 'red',
        role: 'operative',
      });
    });

    expect(screen.queryByTestId('avatar-spymasterId')).toBeInTheDocument();
    expect(screen.queryByTestId('avatar-operativeId1')).toBeInTheDocument();
    expect(screen.queryByTestId('avatar-operativeId2')).toBeInTheDocument();
  });

  it('should not add spymaster or operative avatar when send invalid teamType', () => {
    const team: ITeam = {
      spymaster: null,
      operatives: [{ id: 'operativeId1', username: 'operativeName1' }],
    };

    render(
      <RoomTeam
        teamType="red"
        maxCount={4}
        team={team}
        socket={mockSocket as TypedSocket}
      />
    );

    expect(screen.queryByTestId('avatar-spymasterId')).not.toBeInTheDocument();
    expect(screen.queryByTestId('avatar-operativeId1')).toBeInTheDocument();
    expect(screen.queryByTestId('avatar-operativeId2')).not.toBeInTheDocument();

    const callback = (mockSocket.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'room:added-team-and-role'
    )?.[1];

    expect(callback).toBeDefined();

    act(() => {
      callback({
        player: { id: 'spymasterId', username: 'spymaster' },
        teamType: 'blue',
        role: 'spymaster',
      });
      callback({
        player: { id: 'operativeId2', username: 'operativeName2' },
        teamType: 'blue',
        role: 'operative',
      });
    });

    expect(screen.queryByTestId('avatar-spymasterId')).not.toBeInTheDocument();
    expect(screen.queryByTestId('avatar-operativeId1')).toBeInTheDocument();
    expect(screen.queryByTestId('avatar-operativeId2')).not.toBeInTheDocument();
  });
});
