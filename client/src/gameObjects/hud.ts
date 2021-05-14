import { GameObjects, Scene } from "phaser";
import Hand from "./Hand";
import TextButton from "./textButton";
import NumberInput from "./input/numberInput";
import Checkbox from "./input/checkbox";
import Me from "../models/me";

export default class HUD extends GameObjects.Container {
  isFolded: boolean;
  usernameLabel: GameObjects.Text;
  cashLabel: GameObjects.Text;
  currentBetLabel: GameObjects.Text;
  hand: Hand;
  foldButton: TextButton;
  callButton: TextButton;
  betButton: TextButton;
  betInput: NumberInput;
  winnerCheckbox: Checkbox;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    onBet: (amount: number) => void,
    onFold: (isFolded: boolean) => void,
    onIsWinnerChange: (isWinner: boolean) => void
  ) {
    super(scene, x, y);

    this.isFolded = false;
    this.usernameLabel = new GameObjects.Text(scene, 20, 0, "username:", {});
    this.cashLabel = new GameObjects.Text(scene, 20, 20, "cash:", {});
    this.currentBetLabel = new GameObjects.Text(
      scene,
      20,
      40,
      "current bet:",
      {}
    );
    this.hand = new Hand(scene, scene.scale.width / 2, scene.scale.height - 50);

    this.foldButton = new TextButton(
      scene,
      scene.scale.width - 75,
      0,
      "Fold",
      75,
      20,
      () => {
        onFold(!this.isFolded);
      }
    );

    this.callButton = new TextButton(
      scene,
      scene.scale.width - 75,
      30,
      "Call",
      75,
      20,
      () => {
        console.log("Call");
      }
    );

    this.betButton = new TextButton(
      scene,
      scene.scale.width - 75,
      60,
      "Bet",
      75,
      20,
      () => {
        const bet = this.betInput.getValue();
        this.betInput.setValue(0);

        onBet(bet);
      }
    );

    this.betInput = new NumberInput(
      scene,
      scene.scale.width - 75,
      90,
      "bet-input"
    );

    this.winnerCheckbox = new Checkbox(
      scene,
      20,
      60,
      "winner-checkbox",
      onIsWinnerChange,
      "Winner?"
    );

    this.add([
      this.usernameLabel,
      this.cashLabel,
      this.currentBetLabel,
      this.foldButton,
      this.callButton,
      this.betButton,
      this.betInput,
      this.winnerCheckbox,
    ]);

    scene.add.existing(this);
  }

  updatePlayerData(playerData: Me, dealerId: string) {
    this.usernameLabel.text = `username: ${playerData.username}${
      playerData.userId === dealerId ? "👑" : ""
    }`;
    this.cashLabel.text = `cash: $${playerData.cash}`;
    this.currentBetLabel.text = `current bet: $${playerData.currentBet}`;
    this.isFolded = playerData.isFolded;
    this.foldButton.setText(playerData.isFolded ? "Un-fold" : "Fold");
    this.winnerCheckbox.setId(`winner-checkbox-${playerData.userId}`);
    this.winnerCheckbox.setValue(playerData.isWinner);
    this.hand.setCards(playerData.cards);
    this.hand.setIsFolded(playerData.isFolded);
  }
}
