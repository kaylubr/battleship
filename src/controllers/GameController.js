import Player from "../models/Player.js";

class GameController {
  #gameStarted;
  #currentTurn;
  #winner;

  constructor() {
    this.player = new Player('PLAYER');
    this.computer = new Player('COMPUTER');
    this.#gameStarted = false;
    this.#currentTurn = null;
    this.#winner = null;
  }

  #renderBoard() {
    
  }
}

export default GameController;