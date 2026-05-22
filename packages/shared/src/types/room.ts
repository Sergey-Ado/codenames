export type RoomStatus = 'waiting' | 'fulled';

interface Player {
  id: string;
  username: string;
}

export interface RoomPreview {
  id: string;
  name: string;
  status: RoomStatus;
  players: Player[];
  maxCount: number;
  currentCount: number;
}

export interface ITeam {
  spymaster: Player | null;
  operatives: Player[];
}

export interface RoomState {
  id: string;
  name: string;
  maxCount: number;
  teams: {
    red: ITeam;
    blue: ITeam;
    unknown: Player[];
  };
}
