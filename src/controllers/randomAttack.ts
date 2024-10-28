import { db } from '../db';
import { Board } from '../db/board';
import { attack } from './';
import { handleRandomNumber } from '../utils';
import { IGame, ITile, WebSocketClient } from '../types/interfaces';

const randomAttack = (data: string, ws: WebSocketClient) => {
  const { gameId, indexPlayer } = JSON.parse(data);
  const { findGame, findEnemy } = db;
  const game: IGame = findGame(gameId);

  if (!game) return;

  const eIndex: number = findEnemy(game, indexPlayer);
  const eBoard: Board[][] = game.ships[eIndex].gameBoard;

  const tiles: ITile[] = [];

  eBoard.forEach((row, x) => {
    row.forEach((tile, y) => {
      if (!tile.checked) {
        tiles.push({ x, y });
      }
    });
  });

  if (tiles.length > 0) {
    const randomNum: number = handleRandomNumber(0, tiles.length - 1);
    const { x, y } = tiles[randomNum];
    // console.log(`#${indexPlayer} player random attack:`, { x, y });
    attack(
      JSON.stringify({
        gameId,
        x,
        y,
        indexPlayer: ws.index,
      }),
      ws,
    );
  }
};

export default randomAttack;
