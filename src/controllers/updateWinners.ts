import { db } from '../db';
import { updateWinnersResponse } from '../utils';

const addWinnerByName = (name: string) => {
  const { winners, findWinner, addWinner } = db;
  const wIndex: number = findWinner(name);
  if (wIndex !== -1) {
    winners[wIndex].wins++;
  } else {
    const newWinner = { name, wins: 1 };
    addWinner(newWinner);
  }
  updateWinners();
};

const updateWinners = () => {
  const { sockets, winners } = db;

  Object.keys(sockets).forEach((key: string) =>
    sockets[key].send(updateWinnersResponse(winners)),
  );
};

export { addWinnerByName, updateWinners };
