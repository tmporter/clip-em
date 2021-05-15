import { Scene, GameObjects } from "phaser";
import Board from "../gameObjects/board";
import ControlPanel from "../gameObjects/controlPanel";
import HUD from "../gameObjects/hud";
import OpponentContainer from "../gameObjects/opponentContainer";
import GameState from "../models/gameState";
import Me from "../models/me";
import { getSession, setSession } from "../sessionStore";
import socket from "../socket";

export default class Game extends Scene {
  background: GameObjects.Image;
  controlPanel: ControlPanel;
  opponentContainer: OpponentContainer;
  board: Board;
  HUD: HUD;
  me: Me;

  constructor() {
    super({ key: "Game" });
  }

  preload() {
    this.load.image("background", "../assets/table.png");
    this.load.image(
      "deck",
      "../assets/boardgamePack_v2/PNG/Cards/cardBack_blue4.png"
    );

    this.load.multiatlas(
      "cardAtlas",
      "../assets/boardgamePack_v2/Spritesheets/playingCardsTP.json",
      "src/assets/boardgamePack_v2/Spritesheets/"
    );
  }

  // start-up code (UI and logic)
  create() {
    // networking
    const session = getSession();
    if (session) {
      socket.auth = { sessionId: session.sessionId };
    }

    socket.connect();

    socket.on("session", ({ sessionId, userId, username }) => {
      setSession({ sessionId, userId, username });

      socket.auth = { sessionId };
      // socket.userId = userId;
    });

    // set up game objects
    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0);

    this.controlPanel = new ControlPanel(
      this,
      100,
      this.scale.height / 2,
      () => socket.emit("drawCardToBoard"),
      () => socket.emit("dealToAllPlayers"),
      () => socket.emit("resetTable")
    );

    this.opponentContainer = new OpponentContainer(
      this,
      0,
      0,
      (userId, isWinner) => socket.emit("setWinner", { userId, isWinner })
    );

    this.board = new Board(this, this.scale.width / 2, this.scale.height / 2);

    this.HUD = new HUD(
      this,
      0,
      this.scale.height - 150,
      (amount) => socket.emit("updateCurrentBet", amount),
      (isFolded) =>
        socket.emit("setFolded", { userId: this.me.userId, isFolded }),
      (isWinner) =>
        socket.emit("setWinner", { userId: this.me.userId, isWinner })
    );

    // handle socket events
    socket.on("gameState", (gameState: GameState) => {
      this.me = gameState.me;
      this.controlPanel.update(gameState);
      this.board.setCards(gameState.board);
      this.HUD.updatePlayerData(gameState.me, gameState.dealerId);
      this.opponentContainer.setPlayers(
        gameState.players.filter((p) => p.userId !== gameState.me.userId),
        gameState.dealerId
      );
    });
  }

  update() {}
}
