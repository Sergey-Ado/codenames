import { describe, expect, it } from 'vitest';
import { Room } from '../../socket/roomManager/room.ts';
import { Team } from '../../socket/roomManager/team.ts';
import { Game } from '../../socket/roomManager/game.ts';

describe('Game', () => {
  it('initialGame should return true if teams is staffed', () => {
    const room = new Room('name', 4);

    const player1 = { id: 'userId1', username: 'user1' };
    const player2 = { id: 'userId2', username: 'user2' };
    const player3 = { id: 'userId3', username: 'user3' };
    const player4 = { id: 'userId4', username: 'user4' };
    room['players'] = [player1, player2, player3, player4];

    const red = new Team(2);
    const blue = new Team(2);
    red['spymasterId'] = 'userId1';
    red['operativeIds'] = ['userId2'];
    blue['spymasterId'] = 'userId3';
    blue['operativeIds'] = ['userId4'];

    room['teams'] = { red, blue };

    const game = new Game();

    const result = game.initialGame(room);

    expect(result).toBeTruthy();
  });

  it('initialGame should return false if teams is not staffed', () => {
    const room = new Room('name', 4);

    const player1 = { id: 'userId1', username: 'user1' };
    const player2 = { id: 'userId2', username: 'user2' };
    const player3 = { id: 'userId3', username: 'user3' };
    room['players'] = [player1, player2, player3];

    const red = new Team(2);
    const blue = new Team(2);
    red['spymasterId'] = 'userId1';
    red['operativeIds'] = ['userId2'];
    blue['spymasterId'] = 'userId3';
    blue['operativeIds'] = [];

    room['teams'] = { red, blue };

    const game = new Game();

    const result = game.initialGame(room);

    expect(result).toBeFalsy();
  });

  it('getRoomId should return room id', () => {
    const room = new Room('name', 4);
    const roomId = room['id'];

    const game = new Game();
    game.initialGame(room);

    const result = game.getRoomId();

    expect(result).toBe(roomId);
  });
});
