import Player from "../models/Player.js";
import Ships from '../models/Ship.js'

class GameController {
  #gameStarted = false;
  #remainingPlayerShips = [];
  #remainingComputerShips = [];
  #axis = 'HORIZONTAL';
  #currentPlayer = null;
  #currentShip = null;
  #winner = false;

  ROWS = 10;
  COLUMNS = 10;

  constructor() {
    this.player = new Player('YOU');
    this.computer = new Player('COMPUTER');
  }

  run() {
    const leftBoard = document.querySelector('.board-left');
    const rightBoard = document.querySelector('.board-right');
    const startButton = document.querySelector('#start-button');

    this.#renderBoard(leftBoard);
    this.#renderBoard(rightBoard);
    this.#populateShips();
    this.#initializeComputerShips();
    this.#printStatusForPlacingShips();
    
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

        cell.addEventListener('click', this.#handleCellClick.bind(this));
        
        if (board.className === 'board-left') {
          cell.addEventListener('mouseover', this.#handleCellHover.bind(this));
          cell.addEventListener('mouseout', this.#handleCellOut.bind(this));
        }

        board.append(cell);
      }
    }
  }

  #attackBoard(rowToAttack, colToAttack) {
    const computerCell = document.querySelector(`.board-right [data-row="${rowToAttack}"][data-column="${colToAttack}"]`);
    if (computerCell.dataset.hit) return;

    this.#currentPlayer = this.computer;
    let currentBoard = this.#currentPlayer.gameboard;

    const hitShip = currentBoard.receiveAttack(rowToAttack, colToAttack);
    if (hitShip) {
      computerCell.style.backgroundColor = 'rgb(165, 92, 92)';
      computerCell.dataset.hit = 'ship';
    } else {
      computerCell.style.backgroundColor = 'red';
      computerCell.dataset.hit = 'miss'
    }

    this.#checkWinner(currentBoard, 'All enemy ships are sunk. The seas are yours.');

    this.#currentPlayer = this.player;
    currentBoard = this.#currentPlayer.gameboard;

    // Bot automation for attacking
    let emptyCell = false;
    while (!emptyCell) {
      const randomRow = Math.floor(Math.random() * 10);
      const randomColumn = Math.floor(Math.random() * 10);
      const playerCell = document.querySelector(`.board-left [data-row="${randomRow}"][data-column="${randomColumn}"]`);
      const isHitAlready = playerCell.dataset.hit;

      if (isHitAlready) continue;
      
      const hitShip = currentBoard.receiveAttack(randomRow, randomColumn);

      if (hitShip) {
        playerCell.style.backgroundColor = 'rgb(165, 92, 92)';
        playerCell.dataset.hit = 'ship';
      } else {
        playerCell.style.backgroundColor = 'red';
        playerCell.dataset.hit = 'miss'
      }

      emptyCell = true;
    }

    this.#checkWinner(currentBoard, 'All ships lost. Better luck next deployment, Admiral.');
  }

  #handleCellClick({ target }) {
    if (this.#winner) return;

    const status = document.querySelector('#status');
    const shipLength = this.#currentShip.length || 0;
    const currentRow = Number(target.dataset.row);  
    const currentColumn = Number(target.dataset.column);
    const currentBoard = this.#currentPlayer.gameboard;

    const isLeftBoard = target.dataset.board === 'board-left';
    const isRightBoard = target.dataset.board === 'board-right';
    const placingShipPhase = this.#gameStarted && this.#remainingPlayerShips.length > 0;
    const attackingPhase = this.#gameStarted && this.#remainingPlayerShips.length < 1;

    if (placingShipPhase && isRightBoard) return;
    
    if (attackingPhase && isRightBoard) {
      this.#attackBoard(currentRow, currentColumn);
      return;
    }
    
    if (placingShipPhase && isLeftBoard) {
      const success = currentBoard.placeShip(this.#currentShip, currentRow, currentColumn, this.#axis);
      if (!success) {
        status.textContent = 'Cell already occupied. / Out of bounds.';
        setTimeout(() => {
          this.#printStatusForPlacingShips();
        }, 2000);
        return;
      }

      if (this.#axis === 'HORIZONTAL' && currentColumn + shipLength <= 10) {
        for (let i = currentColumn; i <= (currentColumn + shipLength) - 1; i++) {
          const cell = document.querySelector(`[data-row="${currentRow}"][data-column="${i}"]`);
          cell.dataset.occupied = 'true';
          cell.style.backgroundColor = 'gray';
        }
      } else if (this.#axis === "VERTICAL" && currentRow + shipLength <= 10) {
        for (let i = currentRow; i <= (currentRow + shipLength) - 1; i++) {
          const cell = document.querySelector(`[data-row="${i}"][data-column="${currentColumn}"]`);
          cell.dataset.occupied = 'true';
          cell.style.backgroundColor = 'gray';
        }
      }

      this.#remainingPlayerShips.shift();
      this.#currentShip = this.#remainingPlayerShips[0] || [];
      this.#printStatusForPlacingShips();
    } else {
      status.textContent = 'Invalid Placement.'
      setTimeout(() => {
        this.#printStatusForPlacingShips();
      }, 2000);
    }
  }

  #handleCellHover({ target }) {
    const board = target.dataset.board;

    if (!(this.#gameStarted && board === 'board-left' && this.#remainingPlayerShips.length > 0))
      return false;

    const shipLength = this.#currentShip.length;
    const currentRow = Number(target.dataset.row);
    const currentColumn = Number(target.dataset.column);
    
    if (this.#axis === 'HORIZONTAL' && currentColumn + shipLength <= 10) {
      for (let i = currentColumn; i <= (currentColumn + shipLength) - 1; i++) {
        const cell = document.querySelector(`[data-row="${currentRow}"][data-column="${i}"]`);
        cell.style.backgroundColor = 'gray';
      }
    } else if (this.#axis === "VERTICAL" && currentRow + shipLength <= 10) {
      for (let i = currentRow; i <= (currentRow + shipLength) - 1; i++) {
        const cell = document.querySelector(`[data-row="${i}"][data-column="${currentColumn}"]`);
        cell.style.backgroundColor = 'gray';
      }
    }
  }

  #handleCellOut() {
    const allCells = document.querySelectorAll('.board-left .cell');
    const attackingPhase = this.#gameStarted && this.#remainingPlayerShips.length < 1;
  
    if (!attackingPhase) {
      allCells.forEach(cell => {
        if (cell.dataset.occupied === 'false')
          cell.style.backgroundColor = '#fff';
      });
    }
  }

  #initializeComputerShips() {
    this.#currentPlayer = this.computer;
    const currentBoard = this.#currentPlayer.gameboard;

    while(this.#remainingComputerShips.length > 0) {
      let successfullyPlaced = false;
      const ship = this.#remainingComputerShips[0];
      
      while(!successfullyPlaced) {
        const randomRow = Math.floor(Math.random() * 10);
        const randomColumn = Math.floor(Math.random() * 10);
        const randomAxis =  Math.floor(Math.random() * 2) === 0 ? 'HORIZONTAL' : 'VERTICAL';
        successfullyPlaced = currentBoard.placeShip(ship, randomRow, randomColumn, randomAxis);
      }

      this.#remainingComputerShips.shift();
    }

    this.#currentPlayer = this.player;
  }

  #populateShips() {
    this.#remainingPlayerShips = [
      new Ships(5),
      new Ships(4),
      new Ships(3),
      new Ships(3),
      new Ships(2),
    ];
    this.#remainingComputerShips = [
      new Ships(5),
      new Ships(4), 
      new Ships(3), 
      new Ships(3), 
      new Ships(2), 
    ];

    this.#currentShip = this.#remainingPlayerShips[0] ;
  }

  #checkWinner(board, message) {
    const status = document.querySelector('#status');
    if (board.checkIfAllShipsAreSunk()) {
      const retryButton = document.querySelector('#retry-link-button');
      const leftBoard = document.querySelector('.board-left');
      const rightBoard = document.querySelector('.board-right');

      retryButton.style.display = 'inline';
      leftBoard.classList.toggle('blur');
      rightBoard.classList.toggle('blur');

      status.textContent = message;
      this.#winner = true;
    }
  }

  #toggleAxis({ key }) {
    if (key === 'Shift')
      this.#axis = this.#axis === 'HORIZONTAL' ? 'VERTICAL' : 'HORIZONTAL';
  }

  #printStatusForPlacingShips() {
    const status = document.querySelector('#status');
    const shipsLength = this.#remainingPlayerShips.length;  
    
    switch (shipsLength) {
      case 1:
        status.textContent = 'Deploying: Destroyer (2) — Shift to rotate';
        break;
      case 2:
        status.textContent = 'Deploying: Submarine (3) — Shift to rotate';
        break;
      case 3:
        status.textContent = 'Deploying: Cruiser (3) — Shift to rotate';
        break;
      case 4:
        status.textContent = 'Deploying: Battleship (4) — Shift to rotate';
        break;
      case 5:
        status.textContent = 'Deploying: Carrier (5) — Shift to rotate';
        break;
      default:
        status.textContent = 'All ships deployed — Launch your attack!';
    }
  }
}

export default GameController;