import { db } from '../db';
import { turnResponse } from '../utils';
import { botAttack } from './';
import { ATTACK_STATUS } from '../types/enums';
import { IGame, IGamePlayer } from '../types/interfaces';

const changeTurn = (gameId: number, status?: string) => {
  const { findGame, sockets, findNonBotPlayer } = db;
  const game: IGame = findGame(gameId);
  const { currentPlayer } = game;

  game.currentPlayer =
    status === ATTACK_STATUS.MISS
      ? currentPlayer === 0
        ? 1
        : 0
      : currentPlayer;

  const currentPlayerIndex: number = game.players[game.currentPlayer].index;
  const message: string = turnResponse(currentPlayerIndex);

  if (game.withBot) {
    const nonBotPlayer: IGamePlayer | undefined = findNonBotPlayer(game);
    if (nonBotPlayer) {
      sockets[nonBotPlayer.index].send(message);
    }
    if (currentPlayerIndex === -1) {
      setTimeout(() => {
        botAttack(
          gameId,
          JSON.stringify({ gameId, indexPlayer: currentPlayerIndex }),
        );
      }, 1000);
    }
  } else {
    game.players.forEach((player: IGamePlayer) => {
      sockets[player.index].send(message);
    });
  }
  console.log(`\x1b[32mMessage sent: \x1b[92m${message}\x1b[0m`);
};

export default changeTurn;
