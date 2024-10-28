import { IPlayer } from '../types/interfaces';

export class NewPlayer implements IPlayer {
  static index = 0;

  name: string;
  password: string;
  online: boolean;
  index: number = 0;

  constructor(name: string, password: string) {
    this.index = NewPlayer.getIndexAndIncrement();
    this.name = name;
    this.password = password;
    this.online = false;
  }

  static getIndexAndIncrement() {
    const currentIndex = NewPlayer.index;
    NewPlayer.index += 1;

    return currentIndex;
  }
}
