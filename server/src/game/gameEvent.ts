export enum EventTypes {
  CardDealtToBoard = "CARD_DEALT_TO_BOARD",
  WinnerPaid = "WINNER_PAID",
  PotCleared = "POT_CLEARED",
  DeckShuffled = "DECK_SHUFFLED",
  ClearBoard = "CLEAR_BOARD",
  ClearHand = "CLEAR_HAND",
  ClearCurrentBet = "CLEAR_CURRENT_BET",
  SetWinner = "SET_WINNER",
  SetFolded = "SET_FOLDED",
  PlayerJoined = "PLAYER_JOINED",
  DealerChanged = "DEALER_CHANGED",
  CardDealtToPlayer = "CARD_DEALT_TO_PLAYER",
  BetPlaced = "BET_PLACED",
}

class GameEvent {
  type: EventTypes;
  payload: any;
  timestamp: Date;

  constructor(type: EventTypes, timestamp: Date, payload?: any) {
    this.type = type;
    this.payload = payload;
    this.timestamp = timestamp;
  }
}

export default GameEvent;
