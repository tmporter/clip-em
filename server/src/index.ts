import * as express from "express";
import * as http from "http";
import { SetFolded, SetWinner } from "../types/socketEvents";
import { v4 as uuidv4 } from "uuid";
// import * as Moniker from "moniker";
import SessionStore from "./sessionStore";
import GameStateRepository from "./game/gameStateRepository";
import { Server } from "socket.io";

const generate = require("project-name-generator");
const path = require("path");
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

const port = process.env.PORT || 3001;
const dataDirectory = path.join(process.cwd(), "\\data");

const sessionStore = new SessionStore(dataDirectory);
const gameStateRepository = new GameStateRepository(dataDirectory);

app.use("/ping", (req, res) => {
  res.send("pong");
});

io.use((socket: any, next: any) => {
  // extract session info from the client connection
  const sessionId = socket.handshake.auth.sessionId;

  if (sessionId) {
    const session = sessionStore.findSession(sessionId);

    if (session) {
      socket.sid = sessionId;
      socket.userId = session.userId;
      socket.username = session.username;
      return next();
    }
  }

  const sid = uuidv4();
  const userId = uuidv4();
  const username = generate().spaced;
  console.log({ sid, userId, username });

  // all signs point to this being a brand new client
  socket.sid = sid;
  socket.userId = userId;
  socket.username = username;

  next();
});

io.on("connection", (socket: any) => {
  // persist the current session
  sessionStore.saveSession(socket.sid, {
    userId: socket.userId,
    username: socket.username,
    connected: true,
  });

  // send session details to the connected client
  socket.emit("session", {
    sessionId: socket.sid,
    userId: socket.userId,
    username: socket.username,
  });

  // add player to the game if they don't already exist
  // gameState.addPlayer(socket.userId, socket.username);
  const gs = gameStateRepository.getCurrentState();
  gs.addPlayer(socket.userId, socket.username);
  gameStateRepository.save(gs);

  // send the current game state to the connected client
  broadcastPersonalizedGameStates();

  // handle global events
  socket.on("drawCardToBoard", () => {
    const gs = gameStateRepository.getCurrentState();
    gs.dealCardToBoard();
    gameStateRepository.save(gs);
    broadcastPersonalizedGameStates();
  });

  socket.on("dealToAllPlayers", () => {
    const gs = gameStateRepository.getCurrentState();
    gs.dealToAllPlayers();
    gameStateRepository.save(gs);
    broadcastPersonalizedGameStates();
  });

  socket.on("resetTable", () => {
    const gs = gameStateRepository.getCurrentState();
    gs.resetTable();
    gameStateRepository.save(gs);
    broadcastPersonalizedGameStates();
  });

  socket.on("setWinner", ({ userId, isWinner }: SetWinner) => {
    const gs = gameStateRepository.getCurrentState();
    gs.setPlayerWinnerStatus(userId, isWinner);
    gameStateRepository.save(gs);
    broadcastPersonalizedGameStates();
  });

  socket.on("setFolded", ({ userId, isFolded }: SetFolded) => {
    const gs = gameStateRepository.getCurrentState();
    gs.setPlayerFoldedStatus(userId, isFolded);
    gameStateRepository.save(gs);
    broadcastPersonalizedGameStates();
  });

  // handle user actions
  socket.on("updateCurrentBet", (amount: number) => {
    const gs = gameStateRepository.getCurrentState();
    gs.placeBet(socket.userId, amount);
    gameStateRepository.save(gs);
    broadcastPersonalizedGameStates();
  });

  // handle disconnect
  socket.on("disconnect", () => {
    sessionStore.saveSession(socket.sid, {
      userId: socket.userId,
      username: socket.username,
      connected: false,
    });

    // TODO: Update player in gamestate to indicate they are disconnected. I
    // don't want to remove them completely in case they accidentally left or
    // had a network issue.
  });
});

const broadcastPersonalizedGameStates = () => {
  const gs = gameStateRepository.getCurrentState();

  for (let [id, socket] of io.sockets.sockets) {
    socket.emit("gameState", gs.serializeForPlayer((socket as any).userId));
  }
};

httpServer.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}/`)
);
