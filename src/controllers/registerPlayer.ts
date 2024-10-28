import { db } from '../db';
import { NewPlayer } from '../db/player';
import { updateRooms, updateWinners } from './';
import { registrationResponse } from '../utils/handleResponseMessages';
import { WebSocketClient } from '../types/interfaces';

const registerPlayer = (
  name: string,
  password: string,
  ws: WebSocketClient,
) => {
  const { addPlayer, findPlayer, setSocket } = db;
  const existingPlayer = findPlayer(name);
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
    console.log('Message sent:', message);
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
    console.log('Message sent:', message);
  }
};

export default registerPlayer;
