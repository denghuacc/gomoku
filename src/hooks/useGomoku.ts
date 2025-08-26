import { useState, useEffect, useCallback, useRef } from "react";
import { useAudioSystem } from "./useAudioSystem";
import { useGameTimer } from "./useGameTimer";
import { type GameConfig } from "./useGameConfig";

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
  // 音效相关
  audioEnabled: boolean;
  volume: number;
  toggleAudio: () => void;
  setVolume: (volume: number) => void;
  // 配置相关
  applyConfig: (config: GameConfig) => void;
  // 计时器相关
  timerState: any;
  timerConfig: any;
  updateTimerConfig: (config: any) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  formatTime: (seconds: number) => string;
  isTimeUp: (player: Player) => boolean;
  // 回顾功能相关
  reviewMode: boolean;
  setReviewMode: (mode: boolean) => void;
  currentReviewMove: number;
  setCurrentReviewMove: (move: number) => void;
  autoPlayInterval: number | null;
  setAutoPlayInterval: (interval: number | null) => void;
}

export const useGomoku = (initialConfig?: GameConfig): UseGomokuReturn => {
  // 游戏配置
  const [BOARD_SIZE, setBoardSize] = useState<number>(
    initialConfig?.boardSize || 15
  );
  const [winCondition, setWinCondition] = useState<number>(
    initialConfig?.winCondition || 5
  );
  const [allowUndo, setAllowUndo] = useState<boolean>(
    initialConfig?.allowUndo ?? true
  );

  const [gameBoard, setGameBoard] = useState<GameBoard>(() =>
    Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(0))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>(
    initialConfig?.firstPlayer || 1
  );
  const [gameActive, setGameActive] = useState<boolean>(true);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [gameTime, setGameTime] = useState<number>(0);
  const [winner, setWinner] = useState<Player | null>(null);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 回顾模式相关状态
  const [reviewMode, setReviewMode] = useState<boolean>(false);
  const [currentReviewMove, setCurrentReviewMove] = useState<number>(0);
  const [autoPlayInterval, setAutoPlayInterval] = useState<number | null>(null);
  const [savedGameBoard, setSavedGameBoard] = useState<GameBoard | null>(null);
  const [savedCurrentPlayer, setSavedCurrentPlayer] = useState<Player | null>(
    null
  );

  // 音效系统
  const {
    audioEnabled,
    volume,
    toggleAudio,
    setVolume,
    playMoveSound,
    playWinSound,
  } = useAudioSystem();

  // 计时器系统
  const {
    timerState,
    config: timerConfig,
    updateConfig: updateTimerConfig,
    startTimer: startGameTimer,
    pauseTimer,
    resumeTimer,
    switchPlayer: switchTimerPlayer,
    resetTimer: resetGameTimer,
    isTimeUp,
    formatTime,
  } = useGameTimer();

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
        for (let i = 1; i < BOARD_SIZE; i++) {
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
        for (let i = 1; i < BOARD_SIZE; i++) {
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

        if (count >= winCondition) {
          return true;
        }
      }

      return false;
    },
    [winCondition, BOARD_SIZE]
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

      // 播放落子音效
      playMoveSound();

      // 检查是否超时
      if (isTimeUp(currentPlayer)) {
        setWinner(currentPlayer === 1 ? 2 : 1); // 对手获胜
        setGameActive(false);
        stopTimer();
        playWinSound();
        return true;
      }

      // 检查是否胜利
      if (checkWin(newBoard, row, col, currentPlayer)) {
        setWinner(currentPlayer);
        setGameActive(false);
        stopTimer();
        // 播放胜利音效
        playWinSound();
        return true;
      }

      // 检查是否平局
      if (checkDraw(newBoard)) {
        setGameActive(false);
        stopTimer();
        return true;
      }

      // 切换玩家
      const nextPlayer = currentPlayer === 1 ? 2 : 1;
      setCurrentPlayer(nextPlayer);
      switchTimerPlayer(nextPlayer);
      return true;
    },
    [gameBoard, currentPlayer, gameActive, checkWin, checkDraw, stopTimer]
  );

  // 应用配置
  const applyConfig = useCallback(
    (config: GameConfig) => {
      setBoardSize(config.boardSize);
      setWinCondition(config.winCondition);
      setAllowUndo(config.allowUndo);
      setCurrentPlayer(config.firstPlayer);

      // 重新创建棋盘
      setGameBoard(
        Array(config.boardSize)
          .fill(null)
          .map(() => Array(config.boardSize).fill(0))
      );
      setGameActive(true);
      setMoveHistory([]);
      setGameTime(0);
      setWinner(null);
      setLastMove(null);

      // 重启计时器
      stopTimer();
      startTimer();
      resetGameTimer();
      startGameTimer(config.firstPlayer);
    },
    [startTimer, stopTimer]
  );

  // 悔棋
  const undoMove = useCallback(() => {
    if (moveHistory.length === 0 || !gameActive || !allowUndo) {
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
    setCurrentPlayer(initialConfig?.firstPlayer || 1);
    setGameActive(true);
    setMoveHistory([]);
    setGameTime(0);
    setWinner(null);
    setLastMove(null);

    stopTimer();
    startTimer();
  }, [BOARD_SIZE, initialConfig?.firstPlayer, startTimer, stopTimer]);

  // 在进入回顾模式时保存当前游戏状态
  useEffect(() => {
    if (reviewMode) {
      setSavedGameBoard(gameBoard.map((row) => [...row]));
      setSavedCurrentPlayer(currentPlayer);
      setCurrentReviewMove(moveHistory.length);
    } else {
      if (savedGameBoard && savedCurrentPlayer) {
        setGameBoard(savedGameBoard);
        setCurrentPlayer(savedCurrentPlayer);
      }
      setSavedGameBoard(null);
      setSavedCurrentPlayer(null);
      setAutoPlayInterval(null);
    }
  }, [reviewMode]);

  // 回顾模式下更新棋盘状态
  useEffect(() => {
    if (reviewMode) {
      const newBoard = Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill(0)) as GameBoard;

      // 重放到当前回合
      for (let i = 0; i < currentReviewMove && i < moveHistory.length; i++) {
        const move = moveHistory[i];
        newBoard[move.row][move.col] = move.player;
      }
      setGameBoard(newBoard);
    }
  }, [currentReviewMove, reviewMode]);

  // 自动播放功能
  useEffect(() => {
    if (autoPlayInterval !== null && reviewMode) {
      const timer = setInterval(() => {
        if (currentReviewMove < moveHistory.length) {
          setCurrentReviewMove((prev) => prev + 1);
        } else {
          setAutoPlayInterval(null);
        }
      }, autoPlayInterval);
      return () => clearInterval(timer);
    }
  }, [autoPlayInterval, currentReviewMove, moveHistory.length, reviewMode]);

  // 初始化游戏
  useEffect(() => {
    startTimer();
    startGameTimer(initialConfig?.firstPlayer || 1);
    return () => stopTimer();
  }, [startTimer, stopTimer, startGameTimer, initialConfig?.firstPlayer]);

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
    // 音效相关
    audioEnabled,
    volume,
    toggleAudio,
    setVolume,
    // 配置相关
    applyConfig,
    // 计时器相关
    timerState,
    timerConfig,
    updateTimerConfig,
    pauseTimer,
    resumeTimer,
    resetTimer: resetGameTimer,
    formatTime,
    isTimeUp,
    // 回顾功能相关
    reviewMode,
    setReviewMode,
    currentReviewMove,
    setCurrentReviewMove,
    autoPlayInterval,
    setAutoPlayInterval,
  };
};
