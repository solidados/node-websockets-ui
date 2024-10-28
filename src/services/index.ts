import {
  attack,
  addPlayerToRoom,
  addShips,
  createRoom,
  randomAttack,
  registerPlayer,
  singlePlay,
} from '../controllers';
import { MESSAGE_TYPES } from '../types/enums';
import { WebSocketClient } from '../types/interfaces';

export const router = (message: string, ws: WebSocketClient) => {
  try {
    const { type, data } = JSON.parse(message);

    switch (type) {
      case MESSAGE_TYPES.REGISTRATION: {
        const parsedData = JSON.parse(data);
        const { name, password } = parsedData;
        registerPlayer(name, password, ws);
        break;
      }
      case MESSAGE_TYPES.CREATE_ROOM:
        createRoom(ws);
        break;
      case MESSAGE_TYPES.ADD_USER_TO_ROOM: {
        const indexRoom = JSON.parse(data).indexRoom;
        addPlayerToRoom(indexRoom, ws);
        break;
      }
      case MESSAGE_TYPES.ADD_SHIPS: {
        const { ships, gameId } = JSON.parse(data);
        addShips(gameId, ships, ws);
        break;
      }
      case MESSAGE_TYPES.ATTACK: {
        attack(data, ws);
        break;
      }
      case MESSAGE_TYPES.RANDOM_ATTACK: {
        randomAttack(data, ws);
        break;
      }
      case MESSAGE_TYPES.SINGLE_PLAY: {
        singlePlay(ws);
        break;
      }
      default:
        console.log('Unknown message type');
    }
  } catch (error) {
    console.log(error);
  }
};
