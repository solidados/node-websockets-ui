import WebSocket from 'ws';
import { db } from '../db';
import { router } from '../services';
import { updateRooms, addWinnerByName } from '../controllers';
import { finishResponse } from '../utils';
import {
  IGame,
  IGamePlayer,
  IPlayer,
  IRoom,
  WebSocketClient,
} from '../types/interfaces';
import { EOL } from 'ts-loader/dist/constants';

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
      const player: IPlayer | undefined = findPlayerBySocketName(ws.name);
      if (!player) return;

      player.online = false;
      const games: IGame[] = findGamesByPlayer(player.name);
      const rooms: IRoom[] = findRoomsByPlayer(player.name);

      if (!rooms || !games) return;

      rooms.forEach((room: IRoom) => deleteRoom(room.roomId));

      games.forEach((game: IGame) => {
        const enemy: IGamePlayer | undefined = game.players.find(
          (p: IGamePlayer): boolean => p.index !== player.index,
        );
        const eIndex: number | undefined = enemy?.index;
        if (!game.withBot) {
          game.players.forEach((player: IGamePlayer) => {
            const newMessage: string = finishResponse(eIndex!);
            sockets[player.index].send(newMessage);
          });
          console.log(
            `\x1b[35mThe Battleship #${game.gameId} is over. The winner is \x1b[44m ${enemy?.name} \x1b[0m`,
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
  console.log(`${EOL}> \x1b[33mWebSocket server:\t\x1b[41m closed \x1b[0m`);
};
