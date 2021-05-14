import { GameObjects, Scene } from "phaser";
import CardData from "../models/cardData";
import PlayerData from "../models/playerData";
import Card from "./card";

export default class Hand extends GameObjects.Container {
  scene: Scene;
  isFolded: boolean = false;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    this.scene = scene;
    scene.add.existing(this);
  }

  updatePlayerData({ cards, isFolded }: PlayerData) {
    this.setCards(cards);
    this.setIsFolded(isFolded);
  }

  setCards(cards: CardData[]) {
    this.removeAll();

    let cardWidth = 100;

    if (cards.length > 5) {
      cardWidth -= cards.length * 3;
    }

    this.add(
      cards.map((card, i) => {
        const x = i * cardWidth - ((cards.length - 1) * cardWidth) / 2;
        return new Card(this.scene, x, 0, "cardAtlas", card);
      })
    );
  }

  setIsFolded(isFolded: boolean) {
    this.isFolded = isFolded;
    this.setAlpha(isFolded ? 0.5 : 1);
  }
}
