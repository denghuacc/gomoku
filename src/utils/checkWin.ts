import { Player, GameBoard } from "../hooks/useGomoku";

export function checkWin(
  board: GameBoard,
  row: number,
  col: number,
  player: Player,
  winCondition: number,
  boardSize: number
): boolean {
  const directions: [number, number][] = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [dx, dy] of directions) {
    let count = 1;

    for (let i = 1; i < boardSize; i++) {
      const newRow = row + i * dx;
      const newCol = col + i * dy;
      if (
        newRow < 0 ||
        newRow >= boardSize ||
        newCol < 0 ||
        newCol >= boardSize
      )
        break;
      if (board[newRow][newCol] === player) count++;
      else break;
    }

    for (let i = 1; i < boardSize; i++) {
      const newRow = row - i * dx;
      const newCol = col - i * dy;
      if (
        newRow < 0 ||
        newRow >= boardSize ||
        newCol < 0 ||
        newCol >= boardSize
      )
        break;
      if (board[newRow][newCol] === player) count++;
      else break;
    }

    if (count >= winCondition) return true;
  }

  return false;
}
