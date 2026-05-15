export interface RoomPreview {
  id: string;
  name: string;
  status: string;
  players: Array<{ id: string; username: string }>;
  maxCount: number;
  currentCount: number;
}
