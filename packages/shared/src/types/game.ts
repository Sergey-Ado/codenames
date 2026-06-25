import { Player } from './user.ts';

export type GameTeamType = 'red' | 'blue';

export interface GameTeam {
  spymaster: Player;
  operatives: Player[];
}

export interface GameTeams {
  red: GameTeam;
  blue: GameTeam;
}

export interface GameState {
  id: string;
  name: string;
  maxCount: number;
  teams: GameTeams;
}
