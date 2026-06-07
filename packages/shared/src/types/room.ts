import z from 'zod';
import { RoomCreateInputSchema } from '../schemas/room.ts';

export type RoomStatus = 'waiting' | 'fulled';
export type TypedTeam = 'red' | 'blue' | 'unknown';
export type TypedRole = 'spymaster' | 'operative' | 'unknown';

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

export type RoomCreateInput = z.infer<typeof RoomCreateInputSchema>;
