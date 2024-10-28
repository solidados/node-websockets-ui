import {BotShip, BotShipType} from '../types/interfaces';

const generateShip = (
  x: number,
  y: number,
  direction: boolean,
  type: BotShipType,
): BotShip => ({
  position: { x, y },
  direction,
  type,
  length: getShipLength(type),
});

const getShipLength = (type: BotShipType): number => {
  switch (type) {
    case 'battleship':
      return 4;
    case 'cruiser':
      return 3;
    case 'submarine':
      return 2;
    case 'destroyer':
      return 1;
  }
};

const generateRandomShips = (count: number): BotShip[] => {
  const shipTypes: BotShipType[] = [
    'battleship',
    'cruiser',
    'submarine',
    'destroyer',
  ];

  return Array.from({ length: count }, () => {
    const type: BotShipType =
      shipTypes[Math.floor(Math.random() * shipTypes.length)];
    const x: number = Math.floor(Math.random() * 10);
    const y: number = Math.floor(Math.random() * 10);
    const direction: boolean = Math.random() < 0.5;

    return generateShip(x, y, direction, type);
  });
};

export const botShips: BotShip[][] = Array.from({ length: 5 }, () =>
  generateRandomShips(10),
);
