import { config } from 'dotenv';
import { httpServer } from './http_server';
import './websocket_server';

config();

const HTTP_PORT: number = Number(process.env.HTTP_PORT) || 8181;
const WS_PORT: number = Number(process.env.WS_PORT) || 3000;

console.log(`Start HTTP server static on PORT: ${HTTP_PORT}`);
httpServer.listen(HTTP_PORT);
console.log(`Start WebSocket server on PORT: ${WS_PORT}`);
