import { GameObjects, Scene } from "phaser";
import CardData from "../models/cardData";

export default class Card extends GameObjects.Container {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    atlas: string | Phaser.Textures.Texture,
    data: CardData
  ) {
    super(scene, x, y);

    const fileName = `card${
      data.suit.charAt(0).toUpperCase() + data.suit.slice(1)
    }${data.value}.png`;

    let cardSprite = new GameObjects.Image(scene, 0, 0, atlas, fileName);
    this.add(cardSprite);

    scene.add.existing(this);
  }
}
