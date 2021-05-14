import JsonFileStorage from "../jsonFileStorage";
import GameEvent from "./gameEvent";
import GameState from "./gameState";

class GameStateRepository {
  inMemoryEventStream: GameEvent[] = [];
  storage: JsonFileStorage;

  private readonly STORAGE_ID: string = "GAME_STATE";

  constructor(dataDirectory: string) {
    this.storage = new JsonFileStorage(dataDirectory);

    // load saved game state if it exists
    const savedState = this.storage.load<GameEvent[]>(this.STORAGE_ID);
    if (savedState) {
      this.inMemoryEventStream = savedState;
    }
  }

  getCurrentState(): GameState {
    const gameState = new GameState();

    for (let event of this.inMemoryEventStream) {
      gameState.addEvent(event);
    }

    return gameState;
  }

  save(gameState: GameState) {
    this.inMemoryEventStream = gameState.getEvents();
    this.storage.save(this.inMemoryEventStream, this.STORAGE_ID);
  }
}

export default GameStateRepository;
