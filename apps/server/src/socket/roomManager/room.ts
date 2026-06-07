import {
  ITeam,
  RoomPreview,
  RoomState,
  RoomStatus,
  TypedRole,
  TypedTeam,
} from '@repo/shared/room';
import { Player } from '@repo/shared/user';
import { MockRoom, Teams } from '../../types/types.ts';
import { Team } from './team.ts';
import { v4 as uuid } from 'uuid';

export class Room {
  public id: string = '';
  private name: string = '';
  private maxCount: number = 0;
  private status: RoomStatus = 'waiting';
  private teams: Teams = { red: new Team(), blue: new Team() };
  private players: Player[] = [];

  public constructor(name: string, count: string) {
    this.id = uuid();
    this.name = name;
    this.maxCount = Number(count);
  }

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
      this.teams.red.addOperativeId(operativeId);
    }
    this.teams.blue = new Team(data.maxCount / 2);
    this.teams.blue.addSpymasterId(data.teams.blue.spymasterId);
    for (const operativeId of data.teams.blue.operativeIds) {
      this.teams.blue.addOperativeId(operativeId);
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

  public removePlayer(
    userId: string
  ): { player: Player; teamType: TypedTeam; role: TypedRole } | undefined {
    const player = this.players.find(player => player.id === userId);
    const response = this.removeTeamAndRole(userId);
    if (player && response) {
      this.players = this.players.filter(player => player.id !== userId);
      this.status = 'waiting';
      const { teamType, role } = response;
      return { player, teamType, role };
    }
  }

  public getPlayerIds(): string[] {
    return this.players.map(player => player.id);
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

  public removeTeamAndRole(
    userId: string
  ): { teamType: TypedTeam; role: TypedRole } | undefined {
    if (this.teams.red.getSpymasterId() === userId) {
      this.teams.red.removeSpymasterId();
      return { teamType: 'red', role: 'spymaster' };
    }

    if (this.teams.red.getOperativeIds().includes(userId)) {
      this.teams.red.removeOperativeId(userId);
      return { teamType: 'red', role: 'operative' };
    }

    if (this.teams.blue.getSpymasterId() === userId) {
      this.teams.blue.removeSpymasterId();
      return { teamType: 'blue', role: 'spymaster' };
    }

    if (this.teams.blue.getOperativeIds().includes(userId)) {
      this.teams.blue.removeOperativeId(userId);
      return { teamType: 'blue', role: 'operative' };
    }

    return { teamType: 'unknown', role: 'unknown' };
  }

  public addTeamAndRole(
    userId: string,
    teamType: TypedTeam,
    role: TypedRole
  ):
    | {
        player: Player;
      }
    | undefined {
    const player = this.players.find(player => player.id === userId);

    if (player) {
      if (teamType === 'unknown') {
        return { player };
      } else {
        if (role === 'spymaster' && !this.teams[teamType].getSpymasterId()) {
          this.teams[teamType].addSpymasterId(userId);
          return { player };
        }

        if (
          role === 'operative' &&
          !this.teams[teamType].getOperativeIds().includes(userId)
        ) {
          this.teams[teamType].addOperativeId(userId);
          return { player };
        }
      }
    }
  }

  public canUpdateTeamAndRole(
    userId: string,
    teamType: TypedTeam,
    role: TypedRole
  ): boolean {
    if (!this.hasPlayer(userId)) return false;

    if (teamType !== 'unknown') {
      const team = teamType === 'red' ? this.teams.red : this.teams.blue;

      if (!team.canUpdate(userId, role)) return false;
    }

    return true;
  }
}
