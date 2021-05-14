import Player from "./player";

class PlayerManager {
  players: Player[] = [];

  count() {
    return this.players.length;
  }

  addPlayer(userId: string, username: string) {
    const player = this.findPlayer(userId);
    if (!player) {
      this.players.push(new Player(userId, username));
    }
  }

  findPlayer(userId: string) {
    return this.players.find((p) => p.userId === userId);
  }

  getAllPlayers() {
    return this.players;
  }

  updateCurrentBetForPlayer(userId: string, amount: number) {
    const player = this.findPlayer(userId);
    player.addToCurrentBet(amount);
  }

  setIsWinner(userId: string, isWinner: boolean) {
    const player = this.findPlayer(userId);
    player.setIsWinner(isWinner);
  }

  getWinners() {
    return this.players.filter((p) => p.isWinner) || [];
  }

  payPlayer(userId: string, amount: number) {
    const player = this.findPlayer(userId);
    player.giveCash(amount);
  }

  getTotalBets() {
    return this.players
      .map((p) => p.currentBet)
      .reduce((total, bet) => (total += bet), 0);
  }

  serialize() {
    return this.getAllPlayers().map((player) => player.serialize());
  }
}

export default PlayerManager;
