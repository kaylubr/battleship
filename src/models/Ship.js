class Ship {
  constructor(length) {
    this.length = length;
    this.hitCount = 0;
  }

  hit() {
    this.hitCount += 1
  }
}

export default Ship;