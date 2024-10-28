import { config } from 'dotenv';
import { httpServer } from './http_server';
import { closeWebSocketServer } from './websocket_server';

config();

const HTTP_PORT: number = Number(process.env.HTTP_PORT) || 8181;

httpServer.listen(HTTP_PORT, () =>
  console.log(
    `Start HTTP server static on PORT: \t\x1b[42m ${HTTP_PORT} \x1b[0m`,
  ),
);

process.on('SIGINT', () => {
  closeWebSocketServer();
  httpServer.close(() => {
    console.log(`> \x1b[33mHTTP server:\t\t\x1b[41m closed \x1b[0m`);
    process.exit(0);
  });
});
