import z from 'zod';
import { RoomCreateInputSchema } from '../schemas/room.ts';
import { Player } from './user.ts';

export type RoomStatus = 'waiting' | 'fulled';
export type RoomTeamType = 'red' | 'blue' | 'unknown';
export type TypedRole = 'spymaster' | 'operative' | 'unknown';

export interface RoomPreview {
  id: string;
  name: string;
  status: RoomStatus;
  players: Player[];
  maxCount: number;
  currentCount: number;
}

export interface RoomTeam {
  spymaster: Player | null;
  operatives: Player[];
}

export interface RoomState {
  id: string;
  name: string;
  maxCount: number;
  teams: {
    red: RoomTeam;
    blue: RoomTeam;
    unknown: Player[];
  };
}

export type RoomCreateInput = z.infer<typeof RoomCreateInputSchema>;
