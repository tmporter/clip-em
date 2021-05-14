import Card from "./card";

class Player {
  userId: string;
  username: string;
  cash: number;
  cards: Card[] = [];
  currentBet: number = 0;
  isWinner: boolean = false;
  isFolded: boolean = false;

  constructor(userId: string, username: string, cash: number = 500) {
    this.userId = userId;
    this.username = username;
    this.cash = cash;
  }

  giveCard(card: Card) {
    this.cards.push(card);
  }

  takeCard(i: number) {
    if (i < this.cards.length) {
      return this.cards.splice(i, 1)[0];
    }
  }

  clearHand() {
    this.cards = [];
  }

  giveCash(amt: number) {
    this.cash += +amt;
  }

  takeCash(amt: number) {
    this.cash -= amt;

    if (this.cash < 0) {
      this.cash = 0;
    }
  }

  addToCurrentBet(amount: number) {
    let parsedAmount = +amount;

    if (parsedAmount > this.cash) {
      parsedAmount = this.cash;
    }

    this.currentBet += parsedAmount;
    this.takeCash(parsedAmount);
  }

  clearCurrentBet() {
    this.currentBet = 0;
  }

  setIsWinner(isWinner: boolean) {
    this.isWinner = isWinner;
  }

  setIsFolded(isFolded: boolean) {
    this.isFolded = isFolded;
  }

  serialize() {
    return {
      userId: this.userId,
      username: this.username,
      cash: this.cash,
      currentBet: this.currentBet,
      cardsInHand: this.cards.length,
      isWinner: this.isWinner,
      isFolded: this.isFolded,
    };
  }
}

export default Player;
