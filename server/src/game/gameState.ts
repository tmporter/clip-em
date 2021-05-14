import * as _ from "lodash";
import Card from "./card";
import Deck from "./deck";
import PlayerManager from "./playerManager";
import GameEvent, { EventTypes } from "./gameEvent";

class CurrentState {
  deck: Deck = new Deck();
  board: Card[] = [];
  pot: number = 0;
  previousPot: number = 0;
  dealerId: string | null = null;
  playerManager: PlayerManager = new PlayerManager();
}

class GameState {
  events: GameEvent[] = [];

  // projection
  currentState: CurrentState = new CurrentState();

  dealCardToBoard() {
    this.addEvent(new GameEvent(EventTypes.CardDealtToBoard, new Date()));
  }

  resetTable() {
    const winners = this.currentState.playerManager.getWinners();

    if (winners.length > 0) {
      const share = Math.floor(this.currentState.pot / winners.length);
      const leftovers = this.currentState.pot - share * winners.length;

      for (let winner of winners) {
        this.addEvent(
          new GameEvent(EventTypes.WinnerPaid, new Date(), {
            userId: winner.userId,
            share,
          })
        );
      }

      this.addEvent(
        new GameEvent(EventTypes.PotCleared, new Date(), { leftovers })
      );
    }

    const deck = new Deck();
    deck.resetAndShuffle();

    this.addEvent(
      new GameEvent(EventTypes.DeckShuffled, new Date(), { deck: deck.cards })
    );
    this.addEvent(new GameEvent(EventTypes.ClearBoard, new Date()));

    for (let player of this.currentState.playerManager.getAllPlayers()) {
      this.addEvent(
        new GameEvent(EventTypes.ClearHand, new Date(), {
          userId: player.userId,
        })
      );
      this.addEvent(
        new GameEvent(EventTypes.ClearCurrentBet, new Date(), {
          userId: player.userId,
        })
      );
      this.addEvent(
        new GameEvent(EventTypes.SetWinner, new Date(), {
          userId: player.userId,
          isWinner: false,
        })
      );
      this.addEvent(
        new GameEvent(EventTypes.SetFolded, new Date(), {
          userId: player.userId,
          isFolded: false,
        })
      );
    }
  }

  addPlayer(userId: string, username: string) {
    this.addEvent(
      new GameEvent(EventTypes.PlayerJoined, new Date(), { userId, username })
    );

    if (!this.currentState.dealerId) {
      this.addEvent(
        new GameEvent(EventTypes.DealerChanged, new Date(), { userId })
      );
    }
  }

  removePlayer() {}

  dealCardToPlayer(userId: string) {}

  dealToAllPlayers() {
    const players = this.currentState.playerManager.getAllPlayers();

    if (this.currentState.deck.cards.length < players.length) {
      console.error("Not enough cards left in the deck for all players.");
      return;
    }

    for (let player of players) {
      this.addEvent(
        new GameEvent(EventTypes.CardDealtToPlayer, new Date(), {
          userId: player.userId,
        })
      );
    }
  }

  placeBet(userId: string, amount: number) {
    this.addEvent(
      new GameEvent(EventTypes.BetPlaced, new Date(), { userId, amount })
    );
  }

  setPlayerWinnerStatus(userId: string, isWinner: boolean) {
    this.addEvent(
      new GameEvent(EventTypes.SetWinner, new Date(), { userId, isWinner })
    );
  }

  setPlayerFoldedStatus(userId: string, isFolded: boolean) {
    this.addEvent(
      new GameEvent(EventTypes.SetFolded, new Date(), { userId, isFolded })
    );
  }

  /**
   * Add a game event to the event stream and apply the event to the current
   * state projection.
   * @param event The game event to add.
   */
  addEvent(event: GameEvent) {
    this.events.push(event);
    this.apply(event);
  }

  getEvents(): GameEvent[] {
    return this.events;
  }

  /**
   * Apply a game event to the current state projection.
   * @param event The game event to apply.
   */
  apply(event: GameEvent) {
    switch (event.type) {
      case EventTypes.CardDealtToBoard:
        const cardToDeal = this.currentState.deck.draw();

        if (cardToDeal) {
          this.currentState.board.push(cardToDeal);
        }
        break;
      case EventTypes.WinnerPaid:
        this.currentState.playerManager.payPlayer(
          event.payload.userId,
          event.payload.share
        );
        break;
      case EventTypes.PotCleared:
        this.currentState.pot = event.payload.leftovers;
        break;
      case EventTypes.DeckShuffled:
        this.currentState.deck = _.cloneDeep(new Deck(event.payload.deck));
        break;
      case EventTypes.ClearBoard:
        this.currentState.board = [];
        break;
      case EventTypes.ClearHand:
        this.currentState.playerManager
          .findPlayer(event.payload.userId)
          .clearHand();
        break;
      case EventTypes.ClearCurrentBet:
        this.currentState.playerManager
          .findPlayer(event.payload.userId)
          .clearCurrentBet();
        break;
      case EventTypes.SetWinner:
        this.currentState.playerManager
          .findPlayer(event.payload.userId)
          .setIsWinner(event.payload.isWinner);
        break;
      case EventTypes.SetFolded:
        this.currentState.playerManager
          .findPlayer(event.payload.userId)
          .setIsFolded(event.payload.isFolded);
        break;
      case EventTypes.PlayerJoined:
        this.currentState.playerManager.addPlayer(
          event.payload.userId,
          event.payload.username
        );
        break;
      case EventTypes.DealerChanged:
        this.currentState.dealerId = event.payload.userId;
        break;
      case EventTypes.CardDealtToPlayer:
        const card = this.currentState.deck.draw();
        const player = this.currentState.playerManager.findPlayer(
          event.payload.userId
        );
        player.giveCard(card);
        break;
      case EventTypes.BetPlaced:
        this.currentState.pot += +event.payload.amount;
        this.currentState.playerManager.updateCurrentBetForPlayer(
          event.payload.userId,
          event.payload.amount
        );
        break;
      default:
        console.error(`unhandled game event: ${event.type}`);
        break;
    }
  }

  serializeForPlayer(userId: string): any {
    return {
      deck: this.currentState.deck.serialize(),
      board: this.currentState.board,
      pot: this.currentState.pot,
      previousPot: this.currentState.previousPot,
      players: this.currentState.playerManager.serialize(),
      me: this.currentState.playerManager.findPlayer(userId),
      dealerId: this.currentState.dealerId,
    };
  }
}

export default GameState;
