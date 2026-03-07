import { test, expect, describe, beforeEach } from '@jest/globals';
import GameBoard from '../src/models/GameBoard.js';
import Ship from '../src/models/Ship.js';
import { checkBoardSize } from './testHelper.js';

describe('when GameBoard is created', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new GameBoard();
  });

  test('board should have the correct size', () => {
    const isBoardSizeCorrect = checkBoardSize(gameboard.board);
    expect(isBoardSizeCorrect).toBe(true);
  });

  test('it should allow ships to be placed horizontally', () => {
    const ship = new Ship(3);
    gameboard.placeShip(ship, 5, 5, 'HORIZONTAL');

    expect(gameboard.board[5][5].ship).not.toBeNull();
    expect(gameboard.board[5][5 + (ship.length - 1)].ship).not.toBeNull();
  });

  test("ships can't be placed if there's a ship in the range horizontally", () => {
    const ship = new Ship(3);
    const anotherShip = new Ship(4);

    gameboard.placeShip(ship, 0, 3, 'HORIZONTAL');
    gameboard.placeShip(anotherShip, 0, 0, 'HORIZONTAL');

    expect(gameboard.board[0][0].ship).toBeNull();
    expect(gameboard.board[0][0 + (anotherShip.length - 1)].ship).not.toBeNull();
  });

  test('it should allow ships to be placed vertically', () => {
    const ship = new Ship(3);
    gameboard.placeShip(ship, 5, 5, 'VERTICAL');

    expect(gameboard.board[5][5].ship).not.toBeNull();
    expect(gameboard.board[5 + (ship.length - 1)][5].ship).not.toBeNull();
  });

  test("ships can't be placed if there's a ship in the range vertically", () => {
    const ship = new Ship(3);
    const anotherShip = new Ship(4);

    gameboard.placeShip(ship, 1, 0, 'HORIZONTAL');
    gameboard.placeShip(anotherShip, 0, 0, 'VERTICAL');

    expect(gameboard.board[0][0].ship).toBeNull();
    expect(gameboard.board[0 + (anotherShip.length - 1)][0].ship).toBeNull();
  });

  test('receiveAttack will use the hit method of the ship inside the cell', () => {
    const ship = new Ship(3);
    gameboard.placeShip(ship, 0, 0, 'HORIZONTAL');
    gameboard.receiveAttack(0, 0);

    expect(gameboard.board[0][0].isHit).toBe(true);
    expect(gameboard.board[0][0].ship.hitCount).toBe(1);
  });

  test('receiveAttack returns true if all ships are sunk after it hits a ship', () => {
    const ship1 = new Ship(1);
    const ship2 = new Ship(2);
    const ship3 = new Ship(3);

    gameboard.placeShip(ship1, 0, 0, 'HORIZONTAL');
    gameboard.receiveAttack(0, 0);

    gameboard.placeShip(ship2, 1, 0, 'HORIZONTAL');
    gameboard.receiveAttack(1, 0);
    gameboard.receiveAttack(1, 1);

    gameboard.placeShip(ship3, 2, 0, 'HORIZONTAL');
    gameboard.receiveAttack(2, 0);
    gameboard.receiveAttack(2, 1);
    const allShipSunk = gameboard.receiveAttack(2, 2);

    expect(allShipSunk).toBe(true);
  });
});