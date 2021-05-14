import Card from "./card";
import * as deck from "./deck.json";
import { getRandomInt } from "../utilities";

class Deck {
  // cards[0] is the "top" of the deck
  cards: Card[];

  constructor(cards: Card[] = []) {
    this.cards = cards;
  }

  // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Pencil-and-paper_method
  shuffle() {
    for (let i = 0; i < this.cards.length - 2; i++) {
      const j = getRandomInt(i, this.cards.length);
      const temp = this.cards[j];
      this.cards[j] = this.cards[i];
      this.cards[i] = temp;
    }
  }

  /**
   * Draws a single card off the top of the deck.
   *
   * @returns The top card of the deck or null if the deck is empty.
   */
  draw() {
    if (this.cards.length > 1) {
      return this.cards.shift();
    }

    return null;
  }

  resetAndShuffle() {
    this.cards = [];

    for (let card of deck) {
      this.cards.push(new Card(card.suit, card.value.toString()));
    }

    this.shuffle();
  }

  isEmpty() {
    return this.cards.length === 0;
  }

  /**
   * Sanitize and serialize the deck object to be broadcast to clients.
   */
  serialize() {
    return {
      count: this.cards.length,
    };
  }
}

export default Deck;
