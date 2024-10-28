import { Board } from './board';
import { ATTACK_STATUS, TILE_STATUS } from '../types/enums';
import { IShip } from '../types/interfaces';

export class Game {
  ships: IShip[];
  gameBoard: Board[][];

  constructor(ships: IShip[]) {
    this.ships = ships;
    this.gameBoard = this.createGameBoard();
  }

  createGameBoard = () => {
    const gameBoard: Board[][] = new Array(10)
      .fill(null)
      .map((_, y) =>
        new Array(10)
          .fill(null)
          .map((_, x) => new Board(x, y, TILE_STATUS.EMPTY)),
      );

    this.ships.forEach(({ position, direction, length }) => {
      const { x, y } = position;
      new Array(length).fill(null).forEach((_, i) => {
        const [tX, tY] = direction ? [x, y + i] : [x + i, y];
        gameBoard[tX][tY].status = TILE_STATUS.SHIP;
      });
    });

    return gameBoard;
  };

  getShips = () => {
    const shipsCoordinates: number[][] = [];

    this.ships.forEach(({ position, direction, length }) => {
      const { x, y } = position;
      for (let i = 0; i < length; i++) {
        const [tX, tY] = direction ? [x, y + i] : [x + i, y];
        shipsCoordinates.push([tX, tY]);
      }
    });
    return shipsCoordinates;
  };

  getTilesAround = (shipIndex: number): number[][] => {
    const { position, direction, length } = this.ships[shipIndex];
    const { x, y } = position;
    const allShipsCoordinates = this.getShips();
    const tilesAround: number[][] = [];

    for (
      let i: number = Math.max(x - 1, 0);
      i <= (direction ? x + 1 : x + length);
      i++
    ) {
      for (
        let j: number = Math.max(y - 1, 0);
        j <= (direction ? y + length : y + 1);
        j++
      ) {
        if (i >= 0 && i < 10 && j >= 0 && j < 10) {
          this.gameBoard[i][j].checked = true;
          tilesAround.push([i, j]);
        }
      }
    }
    return tilesAround.filter(([x, y]) =>
      allShipsCoordinates.every(([tX, tY]) => tX !== x || tY !== y),
    );
  };

  getShipTiles = (shipIndex: number): number[][] => {
    const { position, direction, length } = this.ships[shipIndex];
    const { x, y } = position;
    const shipTiles: number[][] = [];

    for (let i: number = 0; i < length; i++) {
      const tX: number = direction ? x : x + i;
      const tY: number = direction ? y + i : y;
      shipTiles.push([tX, tY]);
    }

    return shipTiles;
  };

  isShipKilled = (ship: IShip): boolean => {
    const shipTiles: number[][] = this.getShipTiles(this.ships.indexOf(ship));

    for (const [x, y] of shipTiles) {
      if (this.gameBoard[x][y].status !== TILE_STATUS.DAMAGED) {
        return false;
      }
    }
    return true;
  };

  handleAttack = (x: number, y: number) => {
    this.gameBoard[x][y].checked = true;

    const shipIndex: number = this.ships.findIndex(
      ({ position, direction, length }) => {
        const { x: shipX, y: shipY } = position;
        return (
          x >= shipX &&
          x < (direction ? shipX + 1 : shipX + length) &&
          y >= shipY &&
          y < (direction ? shipY + length : shipY + 1)
        );
      },
    );

    if (shipIndex === -1) {
      return { x, y, status: ATTACK_STATUS.MISS };
    }

    const currentShip: IShip = this.ships[shipIndex];
    this.gameBoard[x][y].status = TILE_STATUS.DAMAGED;

    if (this.isShipKilled(currentShip)) {
      return {
        x,
        y,
        status: ATTACK_STATUS.KILLED,
        tilesAround: this.getTilesAround(shipIndex),
        shipTiles: this.getShipTiles(shipIndex),
      };
    }

    return { x, y, status: ATTACK_STATUS.SHOT };
  };
}
