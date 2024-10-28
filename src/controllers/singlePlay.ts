import { db } from '../db';
import { createGameResponse } from '../utils/handleResponseMessages';
import { updateRooms } from './';
import { IGame, WebSocketClient } from '../types/interfaces';

const singlePlay = (ws: WebSocketClient) => {
  const { rooms, deleteRoom, addRoom } = db;
  const room = addRoom(ws);
  if (room) {
    room.roomUsers.push({ name: `bot_${room.roomId}`, index: -1 });
  }
  updateRooms();
  // console.log('rooms', db.rooms);
  const gameId = room.roomId;
  const game: IGame = {
    gameId,
    players: [],
    ships: {},
    currentPlayer: 0,
    withBot: true,
  };

  game.players.push(
    { index: ws.index, name: ws.name },
    { index: -1, name: `bot_${gameId}` },
  );

  const roomsToDelete = rooms.filter((r) =>
    r.roomUsers.some((user) => user.index === ws.index),
  );
  roomsToDelete.forEach((room) => deleteRoom(room.roomId));

  updateRooms();

  const message = createGameResponse(gameId, ws.index);
  db.sockets[ws.index].send(message);

  console.log('Message sent:', message);

  db.addGame(game);
  console.log(`THE GAME #${gameId} IS CREATED`);
};

export default singlePlay;
