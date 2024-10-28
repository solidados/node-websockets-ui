import { db } from '../db';
import { updateRooms } from './';
import { createGameResponse } from '../utils';
import { IGame, IRoom, IRoomUser, WebSocketClient } from '../types/interfaces';

const singlePlay = (ws: WebSocketClient) => {
  const { rooms, deleteRoom, addRoom } = db;
  const room: IRoom = addRoom(ws);
  if (room) {
    room.roomUsers.push({ name: `bot fleet ${room.roomId}`, index: -1 });
  }
  updateRooms();
  const gameId: number = room.roomId;
  const game: IGame = {
    gameId,
    players: [],
    ships: {},
    currentPlayer: 0,
    withBot: true,
  };

  game.players.push(
    { index: ws.index, name: ws.name },
    { index: -1, name: `bot fleet ${gameId}` },
  );

  const roomsToDelete: IRoom[] = rooms.filter((room: IRoom) =>
    room.roomUsers.some((user: IRoomUser): boolean => user.index === ws.index),
  );
  roomsToDelete.forEach((room: IRoom) => deleteRoom(room.roomId));

  updateRooms();

  const message: string = createGameResponse(gameId, ws.index);
  db.sockets[ws.index].send(message);

  console.log(`Message sent: \x1b[97m${message}\x1b[0m`);

  db.addGame(game);
  console.log(`\x1b[35mThe Battlefield #${gameId} was created\x1b[0m`);
};

export default singlePlay;
