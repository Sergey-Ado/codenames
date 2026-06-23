import { describe, expect, it, vi } from 'vitest';
import { Room } from '../../socket/roomManager/room.ts';
import { RoomPreview } from '@repo/shared/room';
import { Team } from '../../socket/roomManager/team.ts';
import { MockRoom } from '../../types/types.ts';

describe('Room', () => {
  it('should create instance', () => {
    const room = new Room('name', 4);

    expect(room).toBeInstanceOf(Room);
  });

  it('getRoomPReview return room preview', () => {
    const preview: RoomPreview = {
      id: expect.any(String),
      name: 'name',
      maxCount: 4,
      status: 'waiting',
      currentCount: 1,
      players: [{ id: 'userId', username: 'username' }],
    };

    const room = new Room('name', 4);

    room['players'] = preview.players;
    room['status'] = 'waiting';

    const roomPreview = room.getRoomPreview();

    expect(roomPreview).toEqual(preview);
  });

  it('setData should write mock data to room', () => {
    const mockData: MockRoom = {
      id: 'a1b2c3d4-e5f6-4789-1234-567890abcdef',
      name: 'Cosmic Explorers',
      maxCount: 6,
      players: [
        {
          id: 'f0e9d8c7-b6a5-4321-fedc-ba0987654321',
          username: 'StarLord',
        },
        {
          id: '1a2b3c4d-5e6f-4321-abcd-ef0123456789',
          username: 'Cosmo',
        },
        {
          id: 'f0e9d8c7-b6a5-4321-fedc-ba0987654322',
          username: 'Nova',
        },
        {
          id: '1a2b3c4d-5e6f-4321-abcd-ef0123456790',
          username: 'Orion',
        },
      ],
      currentCount: 4,
      status: 'waiting',
      teams: {
        red: {
          spymasterId: 'f0e9d8c7-b6a5-4321-fedc-ba0987654321',
          operativeIds: ['1a2b3c4d-5e6f-4321-abcd-ef0123456789'],
        },
        blue: {
          spymasterId: 'f0e9d8c7-b6a5-4321-fedc-ba0987654322',
          operativeIds: ['1a2b3c4d-5e6f-4321-abcd-ef0123456790'],
        },
      },
    };

    const room = new Room('', 4);
    room.setData(mockData);
  });

  it('hasPlayer method should show whether there is a player in the room', () => {
    const room = new Room('name', 4);
    const player = { id: 'userId', username: 'username' };

    room['players'] = [player];

    expect(room.hasPlayer('userId')).toBeTruthy();
  });

  it('addPlayer method should add player if room status equal waiting', () => {
    const room = new Room('name', 4);
    const player = { id: 'userId', username: 'username' };

    room.addPlayer(player);

    expect(room['players']).toEqual([player]);
  });

  it("addPlayer method should not player if room status don't equal waiting", () => {
    const room = new Room('name', 4);
    const player1 = { id: 'userId1', username: 'username1' };
    const player2 = { id: 'userId2', username: 'username2' };

    room['players'] = [player1];
    room['status'] = 'fulled';

    room.addPlayer(player2);

    expect(room['players']).toEqual([player1]);
  });

  it('addPlayer method should change status to fulled if player count greater or equal maxCount', () => {
    const room = new Room('name', 4);
    const player1 = { id: 'userId1', username: 'username1' };
    const player2 = { id: 'userId2', username: 'username2' };
    const player3 = { id: 'userId3', username: 'username3' };

    room['players'] = [player1, player2, player3];

    expect(room['status']).toEqual('waiting');

    const player4 = { id: 'userId4', username: 'username4' };
    room.addPlayer(player4);

    expect(room['status']).toEqual('fulled');
  });

  it('removePlayer method should remove player if he is found', () => {
    const room = new Room('name', 4);

    const player = { id: 'userId', username: 'username' };
    room['players'] = [player];

    expect(room.hasPlayer('userId')).toBeTruthy();

    const response = room.removePlayer('userId');

    expect(room.hasPlayer('userId')).toBeFalsy();
    expect(response).toEqual({ player, teamType: 'unknown', role: 'unknown' });
  });

  it('removePlayer method should return undefined if player is not found', () => {
    const room = new Room('name', 4);

    const response = room.removePlayer('userId');

    expect(response).toBeUndefined();
  });

  it('getPlayerIds method should return player id list', () => {
    const room = new Room('name', 4);
    const player1 = { id: 'userId1', username: 'username1' };
    const player2 = { id: 'userId2', username: 'username2' };
    const player3 = { id: 'userId3', username: 'username3' };

    room['players'] = [player1, player2, player3];

    const playerIds = room.getPlayerIds();

    expect(playerIds).toEqual(['userId1', 'userId2', 'userId3']);
  });

  it('getRoomState method should return room state', () => {
    const room = new Room('name', 6);

    const player1 = { id: 'userId1', username: 'username1' };
    const player2 = { id: 'userId2', username: 'username2' };
    const player3 = { id: 'userId3', username: 'username3' };
    const player4 = { id: 'userId4', username: 'username4' };
    const player5 = { id: 'userId5', username: 'username5' };

    room['players'] = [player1, player2, player3, player4, player5];
    room['teams'].red['spymasterId'] = 'userId1';
    room['teams'].red['operativeIds'] = ['userId2'];
    room['teams'].blue['spymasterId'] = 'userId3';
    room['teams'].blue['operativeIds'] = ['userId4'];

    const roomState = room.getRoomState();

    expect(roomState).toEqual({
      id: expect.any(String),
      name: 'name',
      maxCount: 6,
      teams: {
        red: {
          spymaster: player1,
          operatives: [player2],
        },
        blue: {
          spymaster: player3,
          operatives: [player4],
        },
        unknown: [player5],
      },
    });
  });

  it('removeTeamAndRole method should call remove method of Team', () => {
    const room = new Room('name', 6);

    const player1 = { id: 'userId1', username: 'username1' };
    const player2 = { id: 'userId2', username: 'username2' };
    const player3 = { id: 'userId3', username: 'username3' };
    const player4 = { id: 'userId4', username: 'username4' };
    const player5 = { id: 'userId5', username: 'username5' };

    room['players'] = [player1, player2, player3, player4, player5];

    room['teams'].red['spymasterId'] = player1.id;
    room['teams'].red['operativeIds'] = [player2.id];
    room['teams'].blue['spymasterId'] = player3.id;
    room['teams'].blue['operativeIds'] = [player4.id];

    const spySpymaster = vi
      .spyOn(Team.prototype, 'removeSpymasterId')
      .mockImplementation(() => {});
    const spyOperative = vi
      .spyOn(Team.prototype, 'removeOperativeId')
      .mockImplementation(() => {});

    const result1 = room.removeTeamAndRole('userId1');
    const result2 = room.removeTeamAndRole('userId2');
    const result3 = room.removeTeamAndRole('userId3');
    const result4 = room.removeTeamAndRole('userId4');
    const result5 = room.removeTeamAndRole('userId5');
    const result6 = room.removeTeamAndRole('userId6');

    expect(spySpymaster).toHaveBeenCalledTimes(2);
    expect(spyOperative).toHaveBeenCalledTimes(2);

    expect(result1).toEqual({ teamType: 'red', role: 'spymaster' });
    expect(result2).toEqual({ teamType: 'red', role: 'operative' });
    expect(result3).toEqual({ teamType: 'blue', role: 'spymaster' });
    expect(result4).toEqual({ teamType: 'blue', role: 'operative' });
    expect(result5).toEqual({ teamType: 'unknown', role: 'unknown' });
    expect(result6).toEqual({ teamType: 'unknown', role: 'unknown' });

    spySpymaster.mockRestore();
    spyOperative.mockRestore();
  });

  it('addTeamAndRole should not set role if teamType equal unknown', () => {
    const player = { id: 'userId', username: 'username' };

    const room = new Room('', 4);
    room['players'] = [player];

    const spyAddSpymasterId = vi
      .spyOn(Team.prototype, 'addSpymasterId')
      .mockImplementation(() => true);
    const spyAddOperativeId = vi
      .spyOn(Team.prototype, 'addOperativeId')
      .mockImplementation(() => true);

    const result = room.addTeamAndRole('userId', 'unknown', 'spymaster');

    expect(result).toEqual({ player });
    expect(spyAddSpymasterId).not.toHaveBeenCalled();
    expect(spyAddOperativeId).not.toHaveBeenCalled();

    spyAddSpymasterId.mockRestore();
    spyAddOperativeId.mockRestore();
  });

  it('addTeamAndRole should set role if teamType is not unknown and role is not occupied', () => {
    const player1 = { id: 'userId1', username: 'username' };
    const player2 = { id: 'userId2', username: 'username' };

    const room = new Room('', 4);
    room['players'] = [player1, player2];

    const spyAddSpymasterId = vi
      .spyOn(Team.prototype, 'addSpymasterId')
      .mockImplementation(() => true);
    const spyAddOperativeId = vi
      .spyOn(Team.prototype, 'addOperativeId')
      .mockImplementation(() => true);

    const result1 = room.addTeamAndRole('userId1', 'red', 'spymaster');
    const result2 = room.addTeamAndRole('userId2', 'red', 'operative');

    expect(result1).toEqual({ player: player1 });
    expect(result2).toEqual({ player: player2 });
    expect(spyAddSpymasterId).toHaveBeenCalled();
    expect(spyAddOperativeId).toHaveBeenCalled();

    spyAddSpymasterId.mockRestore();
    spyAddOperativeId.mockRestore();
  });

  it('addTeamAndRole should not set role if teamType is not unknown and role is occupied', () => {
    const player1 = { id: 'userId1', username: 'username' };
    const player2 = { id: 'userId2', username: 'username' };

    const room = new Room('', 4);
    room['players'] = [player1, player2];
    room['teams'].red['spymasterId'] = 'userId1';
    room['teams'].red['operativeIds'] = ['userId2'];

    const spyAddSpymasterId = vi
      .spyOn(Team.prototype, 'addSpymasterId')
      .mockImplementation(() => true);
    const spyAddOperativeId = vi
      .spyOn(Team.prototype, 'addOperativeId')
      .mockImplementation(() => true);

    const result1 = room.addTeamAndRole('userId1', 'red', 'spymaster');
    const result2 = room.addTeamAndRole('userId2', 'red', 'operative');

    expect(result1).toBeUndefined();
    expect(result2).toBeUndefined();
    expect(spyAddSpymasterId).not.toHaveBeenCalled();
    expect(spyAddOperativeId).not.toHaveBeenCalled();

    spyAddSpymasterId.mockRestore();
    spyAddOperativeId.mockRestore();
  });

  it('addTeamAndRole should return undefined if player is not found', () => {
    const room = new Room('', 4);

    expect(room.addTeamAndRole('userId', 'red', 'spymaster')).toBeUndefined();
  });

  it('canUpdateTeamAndRole should return true if player is found, teamType is unknown and team.canUpdate is true', () => {
    const player = { id: 'userId', username: 'username' };

    const room = new Room('', 4);
    room['players'] = [player];

    const result1 = room.canUpdateTeamAndRole('userId', 'unknown', 'unknown');
    expect(result1).toBeTruthy();

    const spy = vi
      .spyOn(Team.prototype, 'canUpdate')
      .mockImplementation(() => true);

    const result2 = room.canUpdateTeamAndRole('userId', 'red', 'spymaster');
    expect(result2).toBeTruthy();

    spy.mockRestore();
  });

  it('canUpdateTeamAndRole should return false if player is not found', () => {
    const room = new Room('', 4);

    const result = room.canUpdateTeamAndRole('userId', 'unknown', 'unknown');
    expect(result).toBeFalsy();
  });

  it('canUpdateTeamAndRole should return false if teamType is not unknown and team.canUpdate is false', () => {
    const player = { id: 'userId', username: 'username' };

    const room = new Room('', 4);
    room['players'] = [player];

    const spy = vi
      .spyOn(Team.prototype, 'canUpdate')
      .mockImplementation(() => false);

    const result1 = room.canUpdateTeamAndRole('userId', 'red', 'spymaster');
    const result2 = room.canUpdateTeamAndRole('userId', 'blue', 'spymaster');
    expect(result1).toBeFalsy();
    expect(result2).toBeFalsy();

    spy.mockRestore();
  });

  it('canUpdateTeamAndRole should return false if gameStarting is true', () => {
    const player = { id: 'userId', username: 'username' };

    const room = new Room('', 4);
    room['players'] = [player];

    room['gameStarting'] = true;

    const result = room.canUpdateTeamAndRole('userId', 'red', 'spymaster');
    expect(result).toBeFalsy();
  });

  it('startGameStartTimer should return true if teams are staffed', () => {
    vi.spyOn(Team.prototype, 'isStaffed').mockImplementation(() => true);

    const room = new Room('', 4);

    const result = room.startGameStartTimer(vi.fn());

    expect(result).toBeTruthy();
  });

  it('startGameStartTimer should call callback when time has elapsed', () => {
    vi.useFakeTimers();
    vi.spyOn(Team.prototype, 'isStaffed').mockImplementation(() => true);

    const room = new Room('', 4);

    const callback = vi.fn();
    room.startGameStartTimer(callback);

    vi.advanceTimersByTime(15 * 1000);

    expect(callback).toHaveBeenCalled();

    vi.clearAllMocks();
  });

  it('startGameStartTimer should return false if teams are not staffed', () => {
    vi.spyOn(Team.prototype, 'isStaffed').mockImplementation(() => false);

    const room = new Room('', 4);

    const result = room.startGameStartTimer(vi.fn());

    expect(result).toBeFalsy();
  });
});
