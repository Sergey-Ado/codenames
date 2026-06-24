import { describe, expect, it } from 'vitest';
import { Team } from '../../socket/roomManager/team.ts';

describe('Team', () => {
  it('addSpymasterId should set spymasterId and return true if spymasterId is not set', () => {
    const team = new Team(4);

    const result = team.addSpymasterId('spymasterId');

    expect(result).toBeTruthy();
  });

  it('addSpymasterId should not set a new spymasterId and return false if a spymasterId is already set', () => {
    const team = new Team(2);

    team.addSpymasterId('spymasterId1');
    const result = team.addSpymasterId('spymasterId2');

    expect(result).toBeFalsy();
  });

  it('getSpymasterId should return spymasterId', () => {
    const team = new Team(2);

    team.addSpymasterId('spymasterId');
    const result = team.getSpymasterId();

    expect(result).toBe(result);
  });

  it('addOperativeId should add the operativeId and return true if the limit is not reached', () => {
    const team = new Team(2);

    const result = team.addOperativeId('operativeId');

    expect(result).toBeTruthy();
  });

  it('addOperativeId should not add an operativeId and return false if the limit is reached', () => {
    const team = new Team(2);

    team.addOperativeId('operativeId1');
    team.addOperativeId('operativeId2');

    const result = team.addOperativeId('operativeId3');

    expect(result).toBeFalsy();
  });

  it('addOperativeId should return operativeIds', () => {
    const team = new Team(4);

    const operativeIds = ['operativeId1', 'operativeId2', 'operativeId3'];

    for (const id of operativeIds) {
      team.addOperativeId(id);
    }

    const result = team.getOperativeIds();

    expect(result).toEqual(result);
  });

  it('removeSpymasterId should remove spymasterId', () => {
    const team = new Team(4);

    team['spymasterId'] = 'userId';

    team.removeSpymasterId();

    expect(team['spymasterId']).toBe('');
  });

  it('removeOperativeId should remove operativeIds', () => {
    const team = new Team(4);

    team['operativeIds'] = ['operativeId1', 'operativeId2', 'operativeId3'];

    team.removeOperativeId('operativeId2');

    expect(team['operativeIds']).not.toContain('operativeId2');
  });

  it('canUpdate should return true if there are no exceptions', () => {
    const team = new Team(4);

    const result1 = team.canUpdate('userId', 'spymaster');
    expect(result1).toBeTruthy();

    team['spymasterId'] = 'userId';

    const result2 = team.canUpdate('userId', 'operative');
    expect(result2).toBeTruthy();
  });

  it('canUpdate should return false if role is spymaster and spymasterId is occupied', () => {
    const team = new Team(4);

    team['spymasterId'] = 'userId';

    const result = team.canUpdate('userId', 'spymaster');

    expect(result).toBeFalsy();
  });

  it('canUpdate should return false if role is operative and userId is already in list', () => {
    const team = new Team(4);

    team['operativeIds'] = ['userId'];

    const result = team.canUpdate('userId', 'operative');

    expect(result).toBeFalsy();
  });

  it('canUpdate should return false if role is operative and operative count is greater or equal maxCount-1', () => {
    const team = new Team(2);

    team['operativeIds'] = ['userId1'];

    const result = team.canUpdate('userId2', 'operative');

    expect(result).toBeFalsy();
  });

  it('isStaffed return true if team is staffed', () => {
    const team = new Team(2);

    team['spymasterId'] = 'spymasterId';
    team['operativeIds'] = ['operativeId'];

    const result = team.isStaffed();
    expect(result).toBeTruthy();
  });
});
