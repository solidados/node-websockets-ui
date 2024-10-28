import { db } from '../db';
import { updateRooms } from './';
import { createGameResponse } from '../utils';
import {
  IGame,
  IPlayer,
  IRoom,
  IRoomUser,
  WebSocketClient,
} from '../types/interfaces';

const addPlayerToRoom = (indexRoom: number, ws: WebSocketClient) => {
  const { rooms, players, sockets, deleteRoom, addGame } = db;

  const player: IPlayer | undefined = players.find(
    (player: IPlayer): boolean => player.index === ws.index,
  );
  const room: IRoom | undefined = rooms.find(
    (room: IRoom): boolean => room.roomId === indexRoom,
  );

  if (!rooms.length || !player || !room) return;

  const { roomId, roomUsers } = room;
  const { name } = player;

  if (
    roomUsers.length < 2 &&
    !roomUsers.some((user: IRoomUser): boolean => user.index === ws.index)
  ) {
    roomUsers.push({ name, index: ws.index });
    db.rooms = rooms.filter((room: IRoom): boolean => room.roomId !== roomId);

    const roomsToDelete: IRoom[] = rooms.filter((room: IRoom) =>
      room.roomUsers.some(
        (user: IRoomUser): boolean => user.index === ws.index,
      ),
    );
    roomsToDelete.forEach((room: IRoom) => deleteRoom(room.roomId));

    updateRooms();

    const gameId: number = room.roomId;
    const game: IGame = {
      gameId,
      players: [],
      ships: {},
      currentPlayer: 0,
      withBot: false,
    };

    roomUsers.forEach(({ index, name }) => {
      game.players.push({ index, name });

      const message: string = createGameResponse(gameId, index);
      sockets[index].send(message);
      console.log(`\x1b[32mMessage sent: \x1b[92m${message}\x1b[0m`);
    });

    addGame(game);
    console.log(`\x1b[35mThe Battlefield #${gameId} was created\x1b[0m`);
  }
};

export default addPlayerToRoom;
