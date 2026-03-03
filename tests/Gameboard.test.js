import { test, expect, describe } from '@jest/globals';
import Gameboard from '../src/models/Gameboard';
import Ship from '../src/models/Ship';
import { checkBoardSize } from './testHelper.js';

describe('when Gameboard is created', () => {
  const gameboard = new Gameboard();

  test('board should have the correct size', () => {
    const isBoardSizeCorrect = checkBoardSize(gameboard.board);
    expect(isBoardSizeCorrect).toBe(true);
  });
});