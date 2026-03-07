import Player from "../models/Player.js";
import Ships from '../models/Ship.js'

class GameController {
  #gameStarted = false;
  #playerShips = [];
  #computerShips = [];
  #axis = 'HORIZONTAL';
  #currentPlayer = null;
  #currentShip = null;
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
    this.#initializeShips();

    console.log(this.#currentShip);
    
    startButton.addEventListener('click', this.#handleStartButton.bind(this));
    document.addEventListener('keyup', this.#toggleAxis.bind(this));
  }

  #handleStartButton() {
    const buttonContainer = document.querySelector('.button-container');
    const statusContainer = document.querySelector('.status-container');

    buttonContainer.style.display = 'none';
    statusContainer.style.display = 'flex';

    this.#currentPlayer = this.player;
    this.#gameStarted = true;
  }

  #renderBoard(board) {
    for (let i = 0; i < this.ROWS; i++) {
      for (let j = 0; j < this.COLUMNS; j++) {
        const cell = document.createElement('div');
        cell.dataset.row = i;
        cell.dataset.column = j;
        cell.dataset.board = board.className;
        cell.dataset.occupied = 'false';
        cell.classList.add('cell');

        if (board.className === 'board-left') {
          cell.addEventListener('mouseover', this.#handleCellHover.bind(this));
          cell.addEventListener('mouseout', this.#handleCellOut.bind(this));
          cell.addEventListener('click', this.#handleCellClick.bind(this));
        }

        board.append(cell);
      }
    }
  }

  #handleCellClick({ target }) {
    const board = target.dataset.board;
    const status = document.querySelector('#status');

    if (!(this.#gameStarted && board === 'board-left' && this.#playerShips.length > 0))
      return;

    const shipLength = this.#currentShip.length;
    const currentRow = Number(target.dataset.row);
    const currentColumn = Number(target.dataset.column);
    
    if (this.#currentPlayer.gameboard.placeShip(this.#currentShip, currentRow, currentColumn, this.#axis)) {
      if (this.#axis === 'HORIZONTAL' && currentColumn + shipLength < 10) {
        for (let i = currentColumn; i <= (currentColumn + shipLength) - 1; i++) {
          const cell = document.querySelector(`[data-row="${currentRow}"][data-column="${i}"]`);
          cell.dataset.occupied = 'true';
          cell.style.backgroundColor = 'gray';
        }
      } else if (this.#axis === "VERTICAL" && currentRow + shipLength < 10) {
        for (let i = currentRow; i <= (currentRow + shipLength) - 1; i++) {
          const cell = document.querySelector(`[data-row="${i}"][data-column="${currentColumn}"]`);
          cell.dataset.occupied = 'true';
          cell.style.backgroundColor = 'gray';
        }
      }

      this.#playerShips.shift();
      this.#currentShip = this.#playerShips[0];
    } else {
      status.textContent = 'Invalid Placement.'
      setInterval(() => {
        status.textContent = '';
      }, 3000);
    }
  }

  #handleCellHover({ target }) {
    const board = target.dataset.board;

    if (!(this.#gameStarted && board === 'board-left' && this.#playerShips.length > 0))
      return false;

    const shipLength = this.#currentShip.length;
    const currentRow = Number(target.dataset.row);
    const currentColumn = Number(target.dataset.column);
    
    if (this.#axis === 'HORIZONTAL' && currentColumn + shipLength < 10) {
      for (let i = currentColumn; i <= (currentColumn + shipLength) - 1; i++) {
        const cell = document.querySelector(`[data-row="${currentRow}"][data-column="${i}"]`);
        cell.style.backgroundColor = 'gray';
      }
    } else if (this.#axis === "VERTICAL" && currentRow + shipLength < 10) {
      for (let i = currentRow; i <= (currentRow + shipLength) - 1; i++) {
        const cell = document.querySelector(`[data-row="${i}"][data-column="${currentColumn}"]`);
        cell.style.backgroundColor = 'gray';
      }
    }
  }

  #handleCellOut() {
    const allCells = document.querySelectorAll('.board-left .cell');
    allCells.forEach(cell => {
      if (cell.dataset.occupied === 'false')
        cell.style.backgroundColor = '#fff';
    });
  }

  #initializeShips() {
    this.#playerShips = [
      new Ships(5),
      new Ships(4),
      new Ships(3),
      new Ships(3),
      new Ships(2),
    ];
    this.#computerShips = [
      new Ships(5),
      new Ships(4), 
      new Ships(3), 
      new Ships(3), 
      new Ships(2), 
    ];

    this.#currentShip = this.#playerShips[0];
  }

  #toggleAxis({ key }) {
    if (key === 'Shift')
      this.#axis = this.#axis === 'HORIZONTAL' ? 'VERTICAL' : 'HORIZONTAL';
  }
}

export default GameController;