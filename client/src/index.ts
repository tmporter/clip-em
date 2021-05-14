import * as Phaser from "phaser";
import Game from "./scenes/game";

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "phaser-example",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 780,
  },
  scene: [Game],
  dom: {
    createContainer: true,
  },
};

const game = new Phaser.Game(config);
