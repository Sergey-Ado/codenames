import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RoomTeam } from './RoomTeam';
import { ITeam } from '@repo/shared/room';

describe('RoomTeam', () => {
  it('rendered if type = red', () => {
    const team: ITeam = {
      spymaster: { id: 'spymasterId', username: 'spymasterName' },
      operatives: [{ id: 'operativeId', username: 'operativeName' }],
    };
    render(<RoomTeam type="red" maxCount={2} team={team} />);
  });

  it('rendered if type = red', () => {
    const team: ITeam = {
      spymaster: { id: 'spymasterId', username: 'spymasterName' },
      operatives: [{ id: 'operativeId', username: 'operativeName' }],
    };
    render(<RoomTeam type="blue" maxCount={2} team={team} />);
  });

  it('should create an EmptyCell if spymaster is not set, and call console.log when the EmptyCell is clicked', () => {
    const team: ITeam = {
      spymaster: null,
      operatives: [{ id: 'operativeId', username: 'operativeName' }],
    };
    render(<RoomTeam type="red" maxCount={2} team={team} />);

    const emptyCell = screen.getByRole('empty-cell');

    expect(emptyCell).toBeInTheDocument();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    fireEvent.click(emptyCell);

    expect(spy).toHaveBeenCalledWith('add spymaster');

    spy.mockRestore();
  });

  it('should create an EmptyCell if not all operative are set, and call console.log when clicking on the EmptyCell', () => {
    const team: ITeam = {
      spymaster: { id: 'spymasterId', username: 'spymasterName' },
      operatives: [{ id: 'operativeId', username: 'operativeName' }],
    };
    render(<RoomTeam type="red" maxCount={4} team={team} />);

    const emptyCell = screen.getByRole('empty-cell');

    expect(emptyCell).toBeInTheDocument();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    fireEvent.click(emptyCell);

    expect(spy).toHaveBeenCalledWith('add operatives');

    spy.mockRestore();
  });
});
