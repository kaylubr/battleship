import Cell from "./Cell";

class Gameboard {
  ROWS = 10;
  COLUMN = 10;

  constructor() {
    this.board = Array.from({ length: this.ROWS }, () => 
      Array.from({ length: this.COLUMN }, () => new Cell())
    );
  }

  placeShip(ship, row, column, axis) {
    if (!this.checkIfNoConflict(ship, row, column, axis)) {
      return false;
    }

    for (let i = 0; i < ship.length; i++) {
      if (axis === 'HORIZONTAL')
        this.board[row][column + i].ship = ship;
      else if (axis === 'VERTICAL')
        this.board[row + i][column].ship = ship;
    }

    return true
  }

  receiveAttack(row, column) {
    const cell = this.board[row][column];

    if (cell.ship !== null && cell.isHit === false)
      cell.ship.hit();

    cell.isHit = true;
  }

  checkIfNoConflict(ship, row, column, axis) {
    switch (axis) {
      case 'HORIZONTAL':
        const horizontalConflict = this.board[row].slice(column, ship.length);

        for (let i = 0; i < horizontalConflict.length; i++) {
          if (horizontalConflict[i].ship !== null)
            return false;
        }

        break;
      case 'VERTICAL':
        const verticalConflict = this.board.map(row => row[0])

        for (let i = 0; i < verticalConflict.length; i++) {
          if (verticalConflict[i].ship !== null)
            return false;
        }
        break;
    }

    return true;
  }
}

export default Gameboard;