import { WebSocket } from 'ws';
import crypto from 'node:crypto';
import { players } from '../db';
import { Player, RegistrationData, RegistrationResponse } from '../types';
import { createResponse, sendResponse } from './messageParser';

export function registerPlayer(
  ws: WebSocket,
  { name, password }: RegistrationData,
) {
  const existingPlayer = players.find(
    (player: Player): boolean => player.name === name,
  );
  const response: RegistrationResponse = existingPlayer
    ? createResponse(name, existingPlayer.id, true, 'Player already exists')
    : createNewPlayerResponse(name, password);

  sendResponse(ws, response);
}

function createNewPlayerResponse(
  name: string,
  password: string,
): RegistrationResponse {
  const newPlayer: Player = {
    id: crypto.randomUUID(),
    name,
    password,
    wins: 0,
  };
  players.push(newPlayer);
  return createResponse(newPlayer.name, newPlayer.id, false, '');
}
