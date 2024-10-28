import { MESSAGE_TYPES } from '../types/enums';
import { IMessage, IRoom, IShip, IWinner } from '../types/interfaces';

const registrationResponse = (
  name: string,
  index: number,
  error: boolean,
  errorText: string,
) => {
  const message: IMessage = {
    type: MESSAGE_TYPES.REGISTRATION,
    data: JSON.stringify({ name, index, error, errorText }),
    id: 0,
  };

  return JSON.stringify(message);
};

const updateRoomsResponse = (rooms: IRoom[]) => {
  const message: IMessage = {
    type: MESSAGE_TYPES.UPDATE_ROOM,
    data: JSON.stringify(rooms),
    id: 0,
  };

  return JSON.stringify(message);
};

const createGameResponse = (roomId: number, playerId: number) => {
  const message: IMessage = {
    type: MESSAGE_TYPES.CREATE_GAME,
    data: JSON.stringify({
      idGame: roomId,
      idPlayer: playerId,
    }),
    id: 0,
  };

  return JSON.stringify(message);
};

const turnResponse = (currentPlayer: number) => {
  const message: IMessage = {
    type: MESSAGE_TYPES.TURN,
    data: JSON.stringify({
      currentPlayer,
    }),
    id: 0,
  };

  return JSON.stringify(message);
};

const startGameResponse = (ships: IShip[], currentPlayerIndex: number) => {
  const message: IMessage = {
    type: MESSAGE_TYPES.START_GAME,
    data: JSON.stringify({
      ships,
      currentPlayerIndex,
    }),
    id: 0,
  };

  return JSON.stringify(message);
};

const attackResponse = (
  status: string,
  x: number,
  y: number,
  playerIndex: number,
) => {
  const message: IMessage = {
    type: MESSAGE_TYPES.ATTACK,
    data: JSON.stringify({
      position: { x, y },
      currentPlayer: playerIndex,
      status,
    }),
    id: 0,
  };

  return JSON.stringify(message);
};

const finishResponse = (winPlayer: number) => {
  const message: IMessage = {
    type: MESSAGE_TYPES.FINISH,
    data: JSON.stringify({
      winPlayer,
    }),
    id: 0,
  };

  return JSON.stringify(message);
};

const updateWinnersResponse = (winners: IWinner[]) => {
  const message: IMessage = {
    type: MESSAGE_TYPES.UPDATE_WINNERS,
    data: JSON.stringify(winners),
    id: 0,
  };

  return JSON.stringify(message);
};

export {
  registrationResponse,
  updateRoomsResponse,
  createGameResponse,
  turnResponse,
  startGameResponse,
  attackResponse,
  finishResponse,
  updateWinnersResponse,
};
