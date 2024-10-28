import { db } from '../db';
import { ATTACK_STATUS } from '../types/enums';
import { turnResponse } from '../utils';
import { botAttack } from './';

const changeTurn = (gameId: number, status?: string) => {
  const { findGame, sockets, findNonBotPlayer } = db;
  const game = findGame(gameId);
  const { currentPlayer } = game;

  game.currentPlayer =
    status === ATTACK_STATUS.MISS
      ? currentPlayer === 0
        ? 1
        : 0
      : currentPlayer;

  // console.log('currentPlayer', currentPlayer);
  const currentPlayerIndex = game.players[game.currentPlayer].index;
  const message = turnResponse(currentPlayerIndex);

  if (game.withBot) {
    const nonBotPlayer = findNonBotPlayer(game);
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
    game.players.forEach((player) => {
      sockets[player.index].send(message);
    });
  }
  console.log(`Message sent: \x1b[97m${message}\x1b[0m`);
};

export default changeTurn;
