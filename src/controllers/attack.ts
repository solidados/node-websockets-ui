import { db } from '../db';
import { attackResponse, finishResponse } from '../utils';
import { changeTurn } from './';
import { addWinnerByName } from './updateWinners';
import { Game } from '../db/game';
import { Board } from '../db/board';
import { ATTACK_STATUS, TILE_STATUS } from '../types/enums';
import { IGame, IGamePlayer, WebSocketClient } from '../types/interfaces';

const attack = (data: string, ws: WebSocketClient) => {
  const { findGame, findEnemy, sockets, findNonBotPlayer, deleteGame } = db;
  const { gameId, x, y, indexPlayer } = JSON.parse(data);
  const game: IGame = findGame(gameId);

  if (!game) return;

  if (game.players[game.currentPlayer].index !== indexPlayer) return;

  const eIndex: number = findEnemy(game, indexPlayer);
  const ship: Game = game.ships[eIndex];

  if (!ship || ship.gameBoard[x][y].checked) return;

  const attackResult = ship.handleAttack(x, y);
  const { status, tilesAround, shipTiles } = attackResult;

  const sendResponse = (
    status: ATTACK_STATUS,
    x: number,
    y: number,
    index: number,
  ) => {
    const message: string = attackResponse(status, x, y, index);
    sockets[index].send(message);
    if (!game.withBot) {
      sockets[eIndex].send(message);
    }
  };

  if (status === ATTACK_STATUS.KILLED) {
    sendResponse(ATTACK_STATUS.KILLED, x, y, ws.index);
    tilesAround?.forEach(([x, y]) => {
      sendResponse(ATTACK_STATUS.MISS, x, y, ws.index);
    });
    shipTiles?.forEach(([x, y]) => {
      sendResponse(ATTACK_STATUS.KILLED, x, y, ws.index);
    });

    if (
      ship.gameBoard
        .flat()
        .every((tile: Board): boolean => tile.status !== TILE_STATUS.SHIP)
    ) {
      console.log(
        `\x1b[35mThe Battleship #${gameId} is over. The winner is \x1b[44m ${ws.name} \x1b[0m`,
      );
      if (!game.withBot) {
        game.players.forEach((player: IGamePlayer) => {
          const message = finishResponse(ws.index);
          sockets[player.index].send(message);
        });
      } else {
        const nonBotPlayer: IGamePlayer | undefined = findNonBotPlayer(game);
        console.log('nonBotPlayer', nonBotPlayer);
        if (nonBotPlayer) {
          sockets[nonBotPlayer.index].send(finishResponse(ws.index));
        }
      }
      addWinnerByName(ws.name);
      deleteGame(gameId);
      return;
    }
  } else {
    sendResponse(status, x, y, ws.index);
  }
  changeTurn(gameId, status);
  console.log(
    `#${indexPlayer} player attack:`,
    { x, y },
    `with status: ${status}`,
  );
};

export default attack;
