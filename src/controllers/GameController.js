import Player from "../models/Player.js";

class GameController {
  #gameStarted = false;
  #currentTurn = null;
  #winner = null;
  ROWS = 10;
  COLUMNS = 10;

  constructor() {
    this.player = new Player('PLAYER');
    this.computer = new Player('COMPUTER');
  }

  run() {
    const leftBoard = document.querySelector('.board-left');
    const rightBoard = document.querySelector('.board-right');
    const startButton = document.querySelector('#start-button');

    this.#renderBoard(leftBoard);
    this.#renderBoard(rightBoard);

    startButton.addEventListener('click', this.#handleStartButton.bind(this));
  }

  #handleStartButton({ target }) {
    target.style.display = 'none';
    this.#gameStarted = true;
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