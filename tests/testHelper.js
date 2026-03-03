export function checkBoardSize(board) {
  let correctSize = true;

  for (let i = 0; i < board.length; i++) {
    if (board[i].length !== 10) {
      correctSize = false;
    }
  }

  return correctSize;
};

export function clearBoard(board) {
  for (let i = 0; i < board.length; i++)
    board[i] = Array.from({ length: 10 }, () => ({ ship: null, isHit: false }))
}