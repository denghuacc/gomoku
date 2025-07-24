import { useState, useEffect, useCallback, useRef } from "react";

const BOARD_SIZE = 15;

// 类型定义
export type Player = 1 | 2; // 1: 黑棋, 2: 白棋
export type CellValue = 0 | Player; // 0: 空位, 1: 黑棋, 2: 白棋
export type GameBoard = CellValue[][];

export interface Move {
  row: number;
  col: number;
  player: Player;
}

export interface UseGomokuReturn {
  gameBoard: GameBoard;
  currentPlayer: Player;
  gameActive: boolean;
  moveHistory: Move[];
  gameTime: number;
  winner: Player | null;
  lastMove: Move | null;
  makeMove: (row: number, col: number) => boolean;
  undoMove: () => void;
  resetGame: () => void;
  BOARD_SIZE: number;
}

export const useGomoku = (): UseGomokuReturn => {
  const [gameBoard, setGameBoard] = useState<GameBoard>(() =>
    Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(0))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1); // 1: 黑棋, 2: 白棋
  const [gameActive, setGameActive] = useState<boolean>(true);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [gameTime, setGameTime] = useState<number>(0);
  const [winner, setWinner] = useState<Player | null>(null);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 开始计时
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setGameTime((prev) => prev + 1);
    }, 1000);
  }, []);

  // 停止计时
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 检查胜利条件
  const checkWin = useCallback(
    (board: GameBoard, row: number, col: number, player: Player): boolean => {
      const directions: [number, number][] = [
        [1, 0], // 水平
        [0, 1], // 垂直
        [1, 1], // 对角线
        [1, -1], // 反对角线
      ];

      for (const [dx, dy] of directions) {
        let count = 1; // 当前位置已经有一个棋子

        // 正向检查
        for (let i = 1; i < 5; i++) {
          const newRow = row + i * dy;
          const newCol = col + i * dx;

          if (
            newRow < 0 ||
            newRow >= BOARD_SIZE ||
            newCol < 0 ||
            newCol >= BOARD_SIZE
          ) {
            break;
          }

          if (board[newRow][newCol] === player) {
            count++;
          } else {
            break;
          }
        }

        // 反向检查
        for (let i = 1; i < 5; i++) {
          const newRow = row - i * dy;
          const newCol = col - i * dx;

          if (
            newRow < 0 ||
            newRow >= BOARD_SIZE ||
            newCol < 0 ||
            newCol >= BOARD_SIZE
          ) {
            break;
          }

          if (board[newRow][newCol] === player) {
            count++;
          } else {
            break;
          }
        }

        if (count >= 5) {
          return true;
        }
      }

      return false;
    },
    []
  );

  // 检查平局
  const checkDraw = useCallback((board: GameBoard): boolean => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === 0) {
          return false; // 还有空位，不是平局
        }
      }
    }
    return true; // 棋盘已满，平局
  }, []);

  // 落子
  const makeMove = useCallback(
    (row: number, col: number): boolean => {
      if (!gameActive || gameBoard[row][col] !== 0) {
        return false;
      }

      const newBoard = gameBoard.map((row) => [...row]) as GameBoard;
      newBoard[row][col] = currentPlayer;

      const newMove = { row, col, player: currentPlayer };
      setGameBoard(newBoard);
      setMoveHistory((prev) => [...prev, newMove]);
      setLastMove(newMove);

      // 检查是否胜利
      if (checkWin(newBoard, row, col, currentPlayer)) {
        setWinner(currentPlayer);
        setGameActive(false);
        stopTimer();
        return true;
      }

      // 检查是否平局
      if (checkDraw(newBoard)) {
        setGameActive(false);
        stopTimer();
        return true;
      }

      // 切换玩家
      setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
      return true;
    },
    [gameBoard, currentPlayer, gameActive, checkWin, checkDraw, stopTimer]
  );

  // 悔棋
  const undoMove = useCallback(() => {
    if (moveHistory.length === 0 || !gameActive) {
      return;
    }

    const newHistory = [...moveHistory];
    const lastMove = newHistory.pop();

    if (!lastMove) return;

    const newBoard = gameBoard.map((row) => [...row]) as GameBoard;
    newBoard[lastMove.row][lastMove.col] = 0;

    setGameBoard(newBoard);
    setMoveHistory(newHistory);
    setCurrentPlayer(lastMove.player);
    setLastMove(
      newHistory.length > 0 ? newHistory[newHistory.length - 1] : null
    );
  }, [moveHistory, gameBoard, gameActive]);

  // 重置游戏
  const resetGame = useCallback(() => {
    setGameBoard(
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill(0))
    );
    setCurrentPlayer(1);
    setGameActive(true);
    setMoveHistory([]);
    setGameTime(0);
    setWinner(null);
    setLastMove(null);

    stopTimer();
    startTimer();
  }, [startTimer, stopTimer]);

  // 初始化游戏
  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  return {
    gameBoard,
    currentPlayer,
    gameActive,
    moveHistory,
    gameTime,
    winner,
    lastMove,
    makeMove,
    undoMove,
    resetGame,
    BOARD_SIZE,
  };
};
