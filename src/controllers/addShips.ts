import { db } from '../db';
import { Game } from '../db/game';
import { botShips } from './botFleetGeneration';
import { changeTurn } from './';
import { startGameResponse, handleRandomNumber } from '../utils';
import {
  BotShip,
  IGame,
  IGamePlayer,
  IShip,
  WebSocketClient,
} from '../types/interfaces';

const addShips = (gameId: number, ships: IShip[], ws: WebSocketClient) => {
  const { findGame, sockets } = db;
  const game: IGame = findGame(gameId);

  if (game) {
    game.ships[ws.index] = new Game(ships);
    if (Object.keys(game.ships).length === 2 && !game.withBot) {
      game.players.forEach((player: IGamePlayer) => {
        const message: string = startGameResponse(
          game.ships[player.index].ships,
          player.index,
        );
        sockets[player.index].send(message);
        console.log(`\x1b[32mMessage sent: \x1b[92m${message}\x1b[0m`);
      });
      changeTurn(gameId);
    }

    if (game.withBot) {
      const randomShipsIndex: number = handleRandomNumber(
        0,
        botShips.length - 1,
      );
      const randomShips: BotShip[] = botShips[randomShipsIndex];
      game.ships[-1] = new Game(randomShips);

      const message: string = startGameResponse(ships, ws.index);
      sockets[ws.index]!.send(message);
      console.log(`\x1b[32mMessage sent: \x1b[92m${message}\x1b[0m`);
      changeTurn(gameId);
    }
  } else {
    console.log(`\x1b[93mGame was not found. Try again...\x1b[0m`);
  }
};

export default addShips;
