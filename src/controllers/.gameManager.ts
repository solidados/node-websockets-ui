/*
import { WebSocket } from 'ws';
import { rooms } from '../db';
import { Player, Room } from '../types/interfaces';

export function createRoom(ws: WebSocket, player: Player) {
  const roomId = generateRoomId();
  const newRoom: Room = {
    id: roomId,
    players: [player],
  };
  rooms.push(newRoom);
  console.log(`Room created: ${roomId}`);
  sendRoomInfo(ws, roomId);
}

export function joinRoom(ws: WebSocket, roomId: string, player: Player) {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    sendError(ws, 'Room not found');
    return;
  }

  room.players.push(player);
  console.log(`${player.name} joined room: ${roomId}`);
  sendRoomInfo(ws, roomId);
}

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function sendRoomInfo(ws: WebSocket, roomId: string) {
  const response = {
    type: 'room_info',
    data: JSON.stringify({ roomId }),
    id: 0,
  };
  ws.send(JSON.stringify(response));
}

function sendError(ws: WebSocket, errorText: string) {
  const errorResponse = {
    type: 'error',
    data: JSON.stringify({ errorText }),
    id: 0,
  };
  ws.send(JSON.stringify(errorResponse));
}
*/
