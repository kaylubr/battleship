import GameBoard from './GameBoard.js';

class Player {
  constructor(type) {
    this.type = type;
    this.gameboard = new GameBoard();
  }
}

export default Player;