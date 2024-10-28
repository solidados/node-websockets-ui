import { db } from '../db';
import { Game } from '../db/game';
import { changeTurn } from './';
import { botShips } from '../utils/botStrategy';
import { getRandomNumber } from '../utils/getRandomNumber';
import { startGameResponse } from '../utils/handleResponseMessages';
import {
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
        console.log('Message sent:', message);
      });
      changeTurn(gameId);
    }

    if (game.withBot) {
      const randomShipsIndex: number = getRandomNumber(0, botShips.length - 1);
      const randomShips = botShips[randomShipsIndex];
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