import { TILE_STATUS } from '../types/enums';

export class Board {
  constructor(
    public x: number,
    public y: number,
    public status: TILE_STATUS,
    public checked: boolean = false,
  ) {}
}
