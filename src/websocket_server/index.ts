import WebSocket from 'ws';
import { db } from '../db';
import { router } from '../router';
import { updateRooms, addWinnerByName } from '../controllers';
import { finishResponse } from '../utils/handleResponseMessages';
import {
  IGame,
  IGamePlayer,
  IRoom,
  WebSocketClient,
} from '../types/interfaces';

const WS_PORT: number = Number(process.env.WS_PORT) || 3000;

const wss = new WebSocket.Server({
  port: WS_PORT,
  host: 'localhost',
});

wss.on('listening', () => {
  console.log(`Start WebSocket server on PORT: \t\x1b[42m ${WS_PORT} \x1b[0m`);
});

wss.on('error', (error: Error) => {
  console.log(`Error: ${error.message}`);
});

wss.on('connection', (ws: WebSocketClient) => {
  const {
    sockets,
    findPlayerBySocketName,
    deleteSocket,
    deleteRoom,
    deleteGame,
    findRoomsByPlayer,
    findGamesByPlayer,
  } = db;

  console.log(`\x1b[34mNew client connected\x1b[0m`);

  ws.on('message', (message: string) => {
    console.log(`\x1b[32mMessage received: \x1b[92m${message}\x1b[0m`);
    router(message, ws);
  });

  ws.on('close', () => {
    if (ws.name) {
      const player = findPlayerBySocketName(ws.name);
      if (!player) return;

      player.online = false;
      const games = findGamesByPlayer(player.name);
      const rooms = findRoomsByPlayer(player.name);

      if (!rooms || !games) return;

      rooms.forEach((room: IRoom) => deleteRoom(room.roomId));

      games.forEach((game: IGame) => {
        const enemy = game.players.find((p) => p.index !== player.index);
        const eIndex = enemy?.index;
        if (!game.withBot) {
          game.players.forEach((player: IGamePlayer) => {
            const newMessage: string = finishResponse(eIndex!);
            sockets[player.index].send(newMessage);
          });
          console.log(
            `THE GAME #${game.gameId} IS OVER! The winner is ${enemy?.name}`,
          );
          if (enemy) addWinnerByName(enemy.name);
        }
        deleteGame(game.gameId);
      });

      deleteSocket(ws.index);
      updateRooms();
      console.log(
        `\x1b[33mClient with name \x1b[1m\x1b[93m${ws.name}\x1b[0m \x1b[33mdisconnected!\x1b[0m`,
      );
    }
  });
});

export const closeWebSocketServer = () => {
  wss.close();
  console.log('WebSocket server closed!');
};
