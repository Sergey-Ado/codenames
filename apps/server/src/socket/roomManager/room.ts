import { ITeam, RoomPreview, RoomState, RoomStatus } from '@repo/shared/room';
import { Player } from '@repo/shared/user';
import { MockRoom, Teams } from '../../types/types.ts';
import { Team } from './team.ts';

export class Room {
  public id: string = '';
  private name: string = '';
  private maxCount: number = 0;
  private status: RoomStatus = 'waiting';
  private teams: Teams = { red: new Team(), blue: new Team() };
  private players: Player[] = [];

  public getRoomPreview(): RoomPreview {
    const { id, name, maxCount, players, status } = this;
    const currentCount = players.length;
    return { id, name, maxCount, currentCount, players, status };
  }

  public setData(data: MockRoom): void {
    this.id = data.id;
    this.name = data.name;
    this.maxCount = data.maxCount;
    this.players = [...data.players];
    this.status = data.status;
    this.teams.red = new Team(data.maxCount / 2);
    this.teams.red.addSpymasterId(data.teams.red.spymasterId);
    for (const operativeId of data.teams.red.operativeIds) {
      this.teams.red.addOperative(operativeId);
    }
    this.teams.blue = new Team(data.maxCount / 2);
    this.teams.blue.addSpymasterId(data.teams.blue.spymasterId);
    for (const operativeId of data.teams.blue.operativeIds) {
      this.teams.blue.addOperative(operativeId);
    }
  }

  public hasPlayer(userId: string): boolean {
    return this.players.some(({ id }) => id === userId);
  }

  public addPlayer(player: Player): void {
    if (this.status === 'waiting') {
      this.players.push(player);

      if (this.players.length >= this.maxCount) {
        this.status = 'fulled';
      }
    }
  }

  public removePlayer(userId: string): Player | undefined {
    const player = this.players.find(player => player.id === userId);
    if (player) {
      this.players = this.players.filter(player => player.id !== userId);
      this.status = 'waiting';
      return player;
    }
  }

  public getRoomState(): RoomState {
    const { id, name, maxCount } = this;

    const redTeam: ITeam = {
      spymaster: null,
      operatives: [],
    };
    const blueTeam: ITeam = {
      spymaster: null,
      operatives: [],
    };
    const unknown: Player[] = [];

    for (const player of this.players) {
      if (player.id === this.teams.red.getSpymasterId())
        redTeam.spymaster = player;
      else if (this.teams.red.getOperativeIds().includes(player.id))
        redTeam.operatives.push(player);
      else if (player.id === this.teams.blue.getSpymasterId())
        blueTeam.spymaster = player;
      else if (this.teams.blue.getOperativeIds().includes(player.id))
        blueTeam.operatives.push(player);
      else unknown.push(player);
    }

    return {
      id,
      name,
      maxCount,
      teams: {
        red: redTeam,
        blue: blueTeam,
        unknown,
      },
    };
  }
}
