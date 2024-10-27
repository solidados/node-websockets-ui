import { WebSocket } from 'ws';

export interface WebSocketClient extends WebSocket {
  name: string;
  index: number;
}

export interface IMessage {
  type: string;
  data: string;
  id: number;
}

export interface IPlayer {
  name: string;
  password: string;
  online: boolean;
  index: number;
}

export interface IRoom {
  roomId: number;
  roomUsers: IRoomUser[];
}

export interface IRoomUser {
  name: string;
  index: number;
}

export interface ISocket {
  [key: string]: WebSocketClient;
}

export interface IGame {
  gameId: number;
  players: IGamePlayer[];
  currentPlayer: 0 | 1;
  withBot?: boolean;
}

export interface IGamePlayer {
  name: string;
  index: number;
}

export interface IShip {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: string;
}

export interface ITile {
  x: number;
  y: number;
}

export interface IWinner {
  name: string;
  wins: number;
}
