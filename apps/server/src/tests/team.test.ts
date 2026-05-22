import { describe, expect, it } from 'vitest';
import { Team } from '../socket/roomManager/team.ts';

describe('Team', () => {
  it('sets spymasterId and return true if spymasterId is not set', () => {
    const team = new Team(4);

    const result = team.addSpymasterId('spymasterId');

    expect(result).toBeTruthy();
  });

  it('does not set a new spymasterId and return false if a spymasterId is already set', () => {
    const team = new Team(2);

    team.addSpymasterId('spymasterId1');
    const result = team.addSpymasterId('spymasterId2');

    expect(result).toBeFalsy();
  });

  it('return spymasterId', () => {
    const team = new Team(2);

    team.addSpymasterId('spymasterId');
    const result = team.getSpymasterId();

    expect(result).toBe(result);
  });

  it('adds the operativeId and returns true if the limit is not reached', () => {
    const team = new Team(2);

    const result = team.addOperativeId('operativeId');

    expect(result).toBeTruthy();
  });

  it('does not add an operativeId and returns false if the limit is reached', () => {
    const team = new Team(2);

    team.addOperativeId('operativeId1');
    team.addOperativeId('operativeId2');

    const result = team.addOperativeId('operativeId3');

    expect(result).toBeFalsy();
  });

  it('return operativeIds', () => {
    const team = new Team(4);

    const operativeIds = ['operativeId1', 'operativeId2', 'operativeId3'];

    for (const id of operativeIds) {
      team.addOperativeId(id);
    }

    const result = team.getOperativeIds();

    expect(result).toEqual(result);
  });
});
