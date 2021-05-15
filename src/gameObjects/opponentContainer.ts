import { GameObjects, Scene } from "phaser";
import PlayerData from "../models/playerData";
import Opponent from "./opponent";

type IsWinnerChangeCallback = (userId: string, isWinner: boolean) => void;

export default class OpponentContainer extends GameObjects.Container {
  onIsWinnerChange: IsWinnerChangeCallback;
  players: Map<string, Opponent>;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    onIsWinnerChange: IsWinnerChangeCallback
  ) {
    super(scene, x, y);

    this.scene = scene;
    this.onIsWinnerChange = onIsWinnerChange;
    this.players = new Map();

    scene.add.existing(this);
  }

  setPlayers(players: PlayerData[], dealerId: string) {
    this.removeAll();
    this.players = new Map();

    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      const opponent = new Opponent(
        this.scene,
        20 + i * 200,
        20,
        player,
        dealerId,
        (value) => this.onIsWinnerChange(player.userId, value)
      );
      this.players.set(player.userId, opponent);
      this.add(opponent);
    }
  }
}
