import CardData from "./cardData";

type PlayerData = {
  userId: string;
  username: string;
  cash: number;
  cardsInHand: number;
  currentBet: number;
  cards: CardData[]; // TODO: is this property included in the API response?
  isWinner: boolean;
  isFolded: boolean;
};

export default PlayerData;
