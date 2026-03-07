import Player from "../models/Player.js";

class GameController {
  #gameStarted;
  #currentTurn;
  #winner;
  ROWS = 10;
  COLUMNS = 10;

  constructor() {
    this.player = new Player('PLAYER');
    this.computer = new Player('COMPUTER');
    this.#gameStarted = false;
    this.#currentTurn = null;
    this.#winner = null;
  }

  run() {
    const leftBoard = document.querySelector('.board-left');
    const rightBoard = document.querySelector('.board-right');

    this.#renderBoard(leftBoard);
    this.#renderBoard(rightBoard);
  }

  #renderBoard(board) {
    for (let i = 0; i < this.ROWS; i++) {
      for (let j = 0; j < this.COLUMNS; j++) {
        const cell = document.createElement('div');
        cell.dataset.row = i;
        cell.dataset.column = j;
        cell.classList.add('cell');
        board.append(cell);
      }
    }
  }
}

export default GameController;