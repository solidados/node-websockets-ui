import { config } from 'dotenv';
import { WebSocket, WebSocketServer } from 'ws';
import { parseJSON } from '../logic/messageParser';
import { registerPlayer } from '../logic/registerPlayer';
import { RegistrationRequest, RegistrationData } from '../types';

config();

const port: number = Number(process.env.WS_PORT) || 3000;

const wss = new WebSocketServer({ port });

wss.on('connection', (ws: WebSocket) => {
  console.log('New Client connected');
  ws.on('message', (message: string) => handleIncomingMessage(ws, message));
  ws.on('close', () => console.log('Client was disconnected'));
});

function handleIncomingMessage(ws: WebSocket, message: string) {
  const parsedMessage = parseJSON<RegistrationRequest>(message, ws);
  if (!parsedMessage || parsedMessage.type !== 'reg') {
    return;
  }

  const registrationData = parseJSON<RegistrationData>(parsedMessage.data, ws);
  if (registrationData) registerPlayer(ws, registrationData);
}
