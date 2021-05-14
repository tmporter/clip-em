import CardData from "./cardData";
import Me from "./me";
import PlayerData from "./playerData";

type GameState = {
  deck: {
    count: number;
  };
  pot: number;
  me: Me;
  board: CardData[];
  dealerId: string;
  players: PlayerData[];
};

export default GameState;
