import { GameObjects, Scene } from "phaser";
import CardData from "../models/cardData";
import Card from "./card";

export default class Board extends GameObjects.Container {
  scene: Scene;
  x: number;
  y: number;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene = scene;
    this.x = x;
    this.y = y;

    this.setScale(0.75, 0.75);

    scene.add.existing(this);
  }

  setCards(cards: CardData[]) {
    this.removeAll();

    let cardWidth = 150;

    if (cards.length > 5) {
      cardWidth -= cards.length * 4;
    }

    this.add(
      cards.map((card, i) => {
        const x = i * cardWidth - ((cards.length - 1) * cardWidth) / 2;
        return new Card(this.scene, x, 0, "cardAtlas", card);
      })
    );
  }
}
