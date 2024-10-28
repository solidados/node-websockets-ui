import {
  IGame,
  IPlayer,
  IRoom,
  ISocket,
  IWinner,
  WebSocketClient,
} from '../types/interfaces';

export class Database {
  sockets: ISocket;
  players: IPlayer[];
  rooms: IRoom[];
  roomId: number;
  games: IGame[];
  winners: IWinner[];
  constructor() {
    this.sockets = {};
    this.players = [];
    this.rooms = [];
    this.roomId = 0;
    this.games = [];
    this.winners = [];
  }

  addPlayer = (player: IPlayer) => {
    this.players.push(player);
  };

  findPlayer = (name: string) =>
    this.players.find((player) => player.name === name);

  setSocket = (ws: WebSocketClient, index: number) => {
    this.sockets[index] = ws;
  };

  deleteSocket = (index: number) => {
    delete this.sockets[index];
  };

  findPlayerBySocketName = (name: string) =>
    this.players.find((player) => player.name === name);

  findRoomsByPlayer = (name: string) =>
    this.rooms.filter((room) =>
      room.roomUsers.some((user) => user.name === name),
    );

  findGamesByPlayer = (name: string) =>
    this.games.filter((game) =>
      game.players.some((player) => player.name === name),
    );

  addRoom = (ws: WebSocketClient) => {
    const newRoom: IRoom = {
      roomId: ++this.roomId,
      roomUsers: [{ name: ws.name, index: ws.index }],
    };
    this.rooms.push(newRoom);
    return newRoom;
  };

  deleteRoom = (index: number) =>
    (this.rooms = this.rooms.filter((room) => room.roomId !== index));

  addGame = (game: IGame) => {
    this.games.push(game);
  };

  deleteGame = (index: number) =>
    (this.games = this.games.filter((game) => game.gameId !== index));

  findGame = (gameId: number) =>
    this.games.find((game) => game.gameId === gameId)!;

  findEnemy = (game: IGame, index: number) =>
    game.players.filter((player) => player.index !== index)[0]?.index;

  addWinner = (winner: IWinner) => {
    this.winners.push(winner);
  };

  findWinner = (name: string) =>
    this.winners.findIndex((winner) => winner.name === name);

  findNonBotPlayer = (game: IGame) =>
    game.players.find((player) => player.index !== -1);
}

export const db = new Database();
