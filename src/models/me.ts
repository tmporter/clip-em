import CardData from "./cardData";

type Me = {
  userId: string;
  username: string;
  cash: number;
  cardsInHand: number;
  currentBet: number;
  cards: CardData[];
  isWinner: boolean;
  isFolded: boolean;
};

export default Me;
