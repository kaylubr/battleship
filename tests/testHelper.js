export function checkBoardSize(board) {
  let correctSize = true;

  for (let i = 0; i < board.length; i++) {
    if (board[i].length !== 10) {
      correctSize = false;
    }
  }

  return correctSize;
};