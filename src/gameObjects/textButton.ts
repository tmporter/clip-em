import { GameObjects, Scene } from "phaser";

export default class TextButton extends GameObjects.Container {
  text: GameObjects.Text;
  background: GameObjects.Rectangle;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    text: string,
    width: number,
    height: number,
    onClick: () => void,
    color: number = 0xffffff
  ) {
    super(scene, x, y);

    this.text = new GameObjects.Text(scene, 0, 0, text, { color: "#000" });
    this.text.setOrigin(0.5, 0.5);

    this.background = new GameObjects.Rectangle(
      scene,
      0,
      0,
      width,
      height,
      color
    );

    this.background.strokeColor = 0x000;

    this.background
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => this.enterButtonHoverState())
      .on("pointerout", () => this.enterButtonRestState())
      .on("pointerdown", () => this.enterButtonActiveState())
      .on("pointerup", () => {
        this.enterButtonHoverState();
        onClick();
      });

    this.add([this.background, this.text]);

    scene.add.existing(this);
  }

  enterButtonHoverState = () => {
    console.log("hover");
    this.background.isStroked = true;
  }

  enterButtonRestState() {
    this.background.isStroked = false;
  }

  enterButtonActiveState() {
    this.background.isStroked = true;
  }

  setText(text: string) {
    this.text.text = text;
  }
}
