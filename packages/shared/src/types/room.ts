export type RoomStatus = 'waiting' | 'fulled';

export interface RoomPreview {
  id: string;
  name: string;
  status: RoomStatus;
  players: Array<{ id: string; username: string }>;
  maxCount: number;
  currentCount: number;
}
