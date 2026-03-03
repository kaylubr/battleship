class Gameboard {
  ROWS = 10;
  COLUMN = 10;

  constructor() {
    this.board = Array.from({ length: this.ROWS }, () => 
      new Array(this.COLUMN).fill({ ship: null, isHit: false })
    );
  }
}

export default Gameboard;