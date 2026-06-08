import { describe, expect, it } from 'vitest';
import { Lobby } from '../socket/roomManager/lobby.ts';
import { Player } from '@repo/shared/user';

describe('Lobby', () => {
  it('should create instance without players', () => {
    const lobby = new Lobby();

    expect(lobby['players']).toHaveLength(0);
  });

  it('addPlayer method should add new player', () => {
    const lobby = new Lobby();

    const player: Player = {
      id: 'userId',
      username: 'username',
    };

    lobby.addPlayer(player);

    expect(lobby['players']).toEqual([player]);
  });

  it('removePlayer method should remove player if he is in lobby', () => {
    const lobby = new Lobby();

    const player: Player = {
      id: 'userId',
      username: 'username',
    };
    lobby['players'] = [player];

    lobby.removePlayer('userId');

    expect(lobby['players']).toEqual([]);
  });

  it('removePlayer method should not remove player if he is not in lobby', () => {
    const lobby = new Lobby();

    const player: Player = {
      id: 'userId',
      username: 'username',
    };
    lobby['players'] = [player];

    lobby.removePlayer('invalidId');

    expect(lobby['players']).toEqual([player]);
  });

  it('hasPlayer method should show whether there is a player in the lobby', () => {
    const lobby = new Lobby();

    const player: Player = {
      id: 'userId',
      username: 'username',
    };
    lobby['players'] = [player];

    expect(lobby.hasPlayer('userId')).toBeTruthy();
    expect(lobby.hasPlayer('invalidId')).toBeFalsy();
  });

  it('getPlayerIds method should return list of player id', () => {
    const lobby = new Lobby();

    const player: Player = {
      id: 'userId',
      username: 'username',
    };
    lobby['players'] = [player];

    expect(lobby.getPlayerIds()).toEqual(['userId']);
  });
});
