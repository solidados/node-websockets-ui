import { WebSocket, WebSocketServer } from 'ws';
import crypto from 'node:crypto';
import { players } from '../db';
import {
  Player,
  RegistrationRequest,
  RegistrationData,
  RegistrationResponse,
} from '../types';

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws: WebSocket) => {
  console.log(`New Client connected`);

  ws.on('message', (message: string) => handleIncomingMessage(ws, message));
  ws.on('close', () => console.log(`Client was disconnected`));
});

function handleIncomingMessage(ws: WebSocket, message: string) {
  const parsedMessage = parseJSON<RegistrationRequest>(message, ws);
  if (!parsedMessage || parsedMessage.type !== 'reg') {
    return sendError(ws, 'Unknown or invalid command');
  }

  const registrationData = parseJSON<RegistrationData>(parsedMessage.data, ws);
  if (!registrationData) return;

  registerPlayer(ws, registrationData);
}

function parseJSON<T>(data: string, ws: WebSocket): T | null {
  try {
    return JSON.parse(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Invalid JSON format: ${error.message}`);
    } else {
      console.error('Unknown error during JSON parsing');
    }
    sendError(ws, 'Invalid JSON format');
    return null;
  }
}

function registerPlayer(ws: WebSocket, { name, password }: RegistrationData) {
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

function createResponse(
  name: string,
  id: string,
  error: boolean,
  errorText: string,
): RegistrationResponse {
  return {
    type: 'reg',
    data: JSON.stringify({ name, index: id, error, errorText }),
    id: 0,
  };
}

function sendResponse(ws: WebSocket, response: RegistrationResponse) {
  try {
    const jsonResponse = JSON.stringify(response);
    console.log(`>>> Sending response: ${jsonResponse}`);
    ws.send(jsonResponse);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error sending response: ${error.message}`);
    } else {
      console.error('Unknown error during response sending');
    }
    sendError(ws, 'Failed to send response');
  }
}

function sendError(ws: WebSocket, errorText: string) {
  const errorResponse = createResponse('', '', true, errorText);
  sendResponse(ws, errorResponse);
}
