import { GameObjects, Scene } from "phaser";
import PlayerData from "../models/playerData";
import Checkbox from "./input/checkbox";

export default class Opponent extends GameObjects.Container {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    { username, userId, cash, cardsInHand, currentBet, isFolded }: PlayerData,
    dealerId: string,
    onIsWinnerChange: (isWinner: boolean) => void
  ) {
    super(scene, x, y);

    this.setAlpha(isFolded ? 0.5 : 1);

    let usernameLabel = new GameObjects.Text(
      scene,
      0,
      0,
      `${username}${userId === dealerId ? "👑" : ""}`,
      {}
    );

    let cashLabel = new GameObjects.Text(scene, 0, 20, `cash: $${cash}`, {});

    let cardsInHandLabel = new GameObjects.Text(
      scene,
      0,
      40,
      `cards: ${cardsInHand}`,
      {}
    );

    let currentBetLabel = new GameObjects.Text(
      scene,
      0,
      60,
      `current bet: $${currentBet}`,
      {}
    );

    let winnerCheckbox = new Checkbox(
      scene,
      0,
      80,
      `winner-checkbox-${userId}`,
      onIsWinnerChange,
      "Winner?"
    );

    this.add([
      usernameLabel,
      cashLabel,
      cardsInHandLabel,
      currentBetLabel,
      winnerCheckbox,
    ]);

    scene.add.existing(this);
  }
}
