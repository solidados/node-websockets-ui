import { db } from '../db';
import { Game } from '../db/game';
import { changeTurn } from './';
import { botShips } from '../utils/botStrategy';
import { getRandomNumber } from '../utils/getRandomNumber';
import { startGameResponse } from '../utils/handleResponseMessages';
import { IShip, WebSocketClient } from '../types/interfaces';

const addShips = (gameId: number, ships: IShip[], ws: WebSocketClient) => {
  const { findGame, sockets } = db;
  const game = findGame(gameId);
  if (game) {
    game.ships[ws.index] = new Game(ships);
    if (Object.keys(game.ships).length === 2 && !game.withBot) {
      game.players.forEach((player) => {
        const message = startGameResponse(
          game.ships[player.index].ships,
          player.index,
        );
        sockets[player.index].send(message);
        console.log('Message sent:', message);
      });
      changeTurn(gameId);
    }

    if (game.withBot) {
      const randomShipsIndex = getRandomNumber(0, botShips.length - 1);
      const randomShips = botShips[randomShipsIndex];
      game.ships[-1] = new Game(randomShips);
      const message = startGameResponse(ships, ws.index);
      sockets[ws.index]!.send(message);
      console.log('Message sent:', message);
      changeTurn(gameId);
    }
    // console.log('game', game);
  } else {
    console.log('Game not found');
  }
};

export default addShips;
