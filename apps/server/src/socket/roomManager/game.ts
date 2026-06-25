import { Room } from './room.ts';
import { v4 as uuid } from 'uuid';
import { GameTeam, GameTeams, GameTeamType } from '@repo/shared/game';

const defaultTeam: GameTeam = {
  spymaster: { id: '', username: '' },
  operatives: [],
};

export class Game {
  private id: string = uuid();
  private roomId: string = '';
  private roomName = '';
  private teams: GameTeams;

  public constructor() {
    this.teams = {
      red: defaultTeam,
      blue: defaultTeam,
    };
  }

  public initialGame(room: Room): boolean {
    this.roomId = room.id;
    this.roomName = room.name;

    const roomState = room.getRoomState();

    const { maxCount: count } = roomState;
    const { red, blue } = roomState.teams;

    if (
      red.spymaster &&
      red.operatives.length === count / 2 - 1 &&
      blue.spymaster &&
      blue.operatives.length === count / 2 - 1
    ) {
      this.teams = {
        red: {
          spymaster: red.spymaster,
          operatives: red.operatives,
        },
        blue: {
          spymaster: blue.spymaster,
          operatives: blue.operatives,
        },
      };

      return true;
    }

    return false;
  }

  public getGamePlayerIds(): string[] {
    return [...this.getTeamPlayerIds('red'), ...this.getTeamPlayerIds('blue')];
  }

  public getTeamPlayerIds(teamType: GameTeamType): string[] {
    const team = teamType === 'red' ? this.teams.red : this.teams.blue;
    return [team.spymaster, ...team.operatives].map(player => player.id);
  }

  public getRoomId(): string {
    return this.roomId;
  }
}
