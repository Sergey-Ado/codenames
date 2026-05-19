import { RoomPreview, RoomStatus } from '@repo/shared/room';
import { Player } from '@repo/shared/user';

export class Room {
  public id: string = '';
  private name: string = '';
  private maxCount: number = 0;
  private players: Player[] = [];
  private status: RoomStatus = 'waiting';

  public getRoomPreview(): RoomPreview {
    const { id, name, maxCount, players, status } = this;
    const currentCount = players.length;
    return { id, name, maxCount, currentCount, players, status };
  }

  public setData(data: RoomPreview): void {
    this.id = data.id;
    this.name = data.name;
    this.maxCount = data.maxCount;
    this.players = [...data.players];
    this.status = data.status;
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
}
