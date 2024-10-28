import { db } from '../db';
import { updateRooms } from './';
import { createGameResponse } from '../utils/handleResponseMessages';
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
      console.log('Message sent:', message);
    });

    addGame(game);
    console.log(`THE GAME #${gameId} IS CREATED`);
  }
};

export default addPlayerToRoom;
