import { db } from '../db';
import { attackResponse, finishResponse, handleRandomNumber } from '../utils';
import { changeTurn } from './';
import { addWinnerByName } from './updateWinners';
import { ATTACK_STATUS, TILE_STATUS } from '../types/enums';
import { IGame, ITile } from '../types/interfaces';

const botFleetAttack = (gameId: number, data: string) => {
  const { findGame, findEnemy, findNonBotPlayer, deleteGame } = db;
  const game: IGame = findGame(gameId);
  if (!game) return;

  const currentPlayerIndex = game.currentPlayer;
  const eIndex = findEnemy(game, currentPlayerIndex);
  const eBoard = game.ships[eIndex].gameBoard;

  const tiles: ITile[] = [];

  eBoard.forEach((row, x) => {
    row.forEach((tile, y) => {
      if (!tile.checked) {
        tiles.push({ x, y });
      }
    });
  });

  if (tiles.length > 0) {
    const randomNum = handleRandomNumber(0, tiles.length - 1);
    const { x, y } = tiles[randomNum];
    const { findGame, findEnemy, sockets } = db;
    const { gameId, indexPlayer } = JSON.parse(data);
    const game = findGame(gameId);

    if (game.players[game.currentPlayer].index !== indexPlayer) return;

    const eIndex = findEnemy(game, indexPlayer);
    const ship = game.ships[eIndex];

    if (!ship || ship.gameBoard[x][y].checked) return;

    const attackResult = ship.handleAttack(x, y);
    const { status, tilesAround } = attackResult;

    const sendResponse = (
      status: ATTACK_STATUS,
      x: number,
      y: number,
      index: number,
    ) => {
      const message = attackResponse(status, x, y, index);
      sockets[eIndex].send(message);
    };

    if (status === ATTACK_STATUS.KILLED) {
      sendResponse(ATTACK_STATUS.KILLED, x, y, -1);
      tilesAround?.forEach(([x, y]) => {
        sendResponse(ATTACK_STATUS.MISS, x, y, -1);
      });
      if (
        ship.gameBoard.flat().every((tile) => tile.status !== TILE_STATUS.SHIP)
      ) {
        console.log(
          `\x1b[35mThe Battleship #${gameId} is over. The winner is Bot Fleet-\x1b[44m ${gameId} \x1b[0m`,
        );
        const nonBotPlayer = findNonBotPlayer(game);
        if (nonBotPlayer) {
          sockets[nonBotPlayer.index].send(finishResponse(-1));
        }
        addWinnerByName(`bot fleet ${gameId}`);
        deleteGame(gameId);
        return;
      }
    } else {
      sendResponse(status, x, y, -1);
    }
    changeTurn(gameId, status);
    console.log(`bot attack:`, { x, y }, `with status: ${status}`);
  }
};

export default botFleetAttack;
