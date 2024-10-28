import { db } from '../db';
import { updateRooms } from './';
import { IPlayer, IRoom, WebSocketClient } from '../types/interfaces';

const createRoom = (ws: WebSocketClient) => {
  const { findRoomsByPlayer, addRoom, findPlayerBySocketName } = db;
  const player: IPlayer | undefined = findPlayerBySocketName(ws.name);

  if (player) {
    const existingRooms: IRoom[] = findRoomsByPlayer(player.name);
    if (existingRooms.length === 0) {
      addRoom(ws);
      updateRooms();
    } else {
      console.log(`Player ${ws.name} already has a room`);
    }
  } else {
    console.log(`Player ${ws.name} not found`);
  }
};

export default createRoom;
