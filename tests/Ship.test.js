import { test, expect, describe } from '@jest/globals';
import Ship from '../src/models/Ship';

describe('when Ship is created', () => {
  test('it returns the correct length and hit count', () => {
    expect(new Ship(5).length).toBe(5);
  });

  test('hit count increase when hit() is executed', () => {
    const ship = new Ship(5);
    ship.hit();

    expect(ship.hitCount).toBe(1);
  });
});