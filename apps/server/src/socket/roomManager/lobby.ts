import { Player } from '@repo/shared/user';

export class Lobby {
  private players: Player[] = [];

  public addPlayer(player: Player): void {
    this.players.push(player);
    console.log('add player', player);
  }

  public removePlayer(userId: string): Player | undefined {
    const player = this.players.find(({ id }) => id === userId);

    if (player) {
      this.players.filter(({ id }) => id !== player.id);
      return player;
    }
  }

  public hasPlayer(userId: string): boolean {
    return this.players.some(({ id }) => id === userId);
  }
}
