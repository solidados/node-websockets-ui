import { db } from '../db';
import { NewPlayer } from '../db/player';
import { updateRooms, updateWinners } from './';
import { registrationResponse } from '../utils';
import { IPlayer, WebSocketClient } from '../types/interfaces';

const registerPlayer = (
  name: string,
  password: string,
  ws: WebSocketClient,
) => {
  const { addPlayer, findPlayer, setSocket } = db;
  const existingPlayer: IPlayer | undefined = findPlayer(name);
  if (existingPlayer) {
    const response =
      existingPlayer.password !== password
        ? { error: true, errorText: 'Incorrect password' }
        : existingPlayer.online
          ? { error: true, errorText: `User ${name} is already logged in` }
          : { index: existingPlayer.index, name, error: false, errorText: '' };

    if (!existingPlayer.online && !response.error) {
      existingPlayer.online = true;
      ws.index = existingPlayer.index;
      ws.name = name;
      setSocket(ws, existingPlayer.index);
    }
    const message: string = registrationResponse(
      name,
      existingPlayer.index,
      response.error,
      response.errorText,
    );

    ws.send(message);
    updateRooms();
    updateWinners();
    console.log(`\x1b[32mMessage sent: \x1b[92m${message}\x1b[0m`);
  } else {
    const player: NewPlayer = new NewPlayer(name, password);
    const { index } = player;

    addPlayer(player);
    setSocket(ws, index);

    player.online = true;
    ws.index = index;
    ws.name = name;

    const message: string = registrationResponse(name, index, false, '');

    ws.send(message);
    updateRooms();
    updateWinners();
    console.log(`\x1b[32mMessage sent: \x1b[92m${message}\x1b[0m`);
  }
};

export default registerPlayer;
