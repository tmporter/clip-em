import { GameObjects, Scene } from "phaser";
import GameState from "../models/gameState";
import Deck from "./deck";
import TextButton from "./textButton";

export default class ControlPanel extends GameObjects.Container {
  deck: Deck;
  dealButton: TextButton;
  resetButton: TextButton;
  potLabel: GameObjects.Text;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    onDeckClick: () => void,
    onDealClick: () => void,
    onResetClick: () => void
  ) {
    super(scene, x, y);

    this.deck = new Deck(scene, 0, 0, "deck", onDeckClick);

    this.dealButton = new TextButton(
      scene,
      0,
      90,
      "Deal",
      100,
      20,
      onDealClick
    );

    this.resetButton = new TextButton(
      scene,
      0,
      120,
      "Next Hand",
      100,
      20,
      onResetClick
    );

    this.potLabel = new GameObjects.Text(scene, 0, 150, "pot:", {});
    this.potLabel.setOrigin(0.5, 0.5);

    this.add([this.deck, this.dealButton, this.resetButton, this.potLabel]);

    scene.add.existing(this);
  }

  update(gameState: GameState) {
    this.deck.setCardCount(gameState.deck.count);
    this.potLabel.text = `pot: $${gameState.pot}`;
  }
}
