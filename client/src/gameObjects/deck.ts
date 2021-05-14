import { GameObjects, Scene } from "phaser";

export default class Deck extends GameObjects.Container {
  deckSprite: GameObjects.Sprite;
  cardCount: GameObjects.Text;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    sprite: string | Phaser.Textures.Texture,
    onClick: () => void
  ) {
    super(scene, x, y);

    this.deckSprite = new GameObjects.Sprite(scene, 0, 0, sprite);
    this.cardCount = new GameObjects.Text(scene, 0, 0, "52", {
      fontSize: "24px",
    });
    this.cardCount.setOrigin(0.5, 0.5);

    this.setScale(0.75, 0.75);
    this.setSize(this.deckSprite.width, this.deckSprite.height);
    this.setInteractive({ useHandCursor: true }).on("pointerup", () =>
      onClick()
    );

    this.add([this.deckSprite, this.cardCount]);

    scene.add.existing(this);
  }

  setCardCount(value: number) {
    this.cardCount.text = value.toString();
  }
}
