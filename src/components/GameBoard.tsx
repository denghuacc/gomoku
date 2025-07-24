import { useRef, useEffect, useState } from "react";
import { GameBoard as GameBoardType, Player, Move } from "../hooks/useGomoku";

interface GameBoardProps {
  gameBoard: GameBoardType;
  onMove: (row: number, col: number) => boolean;
  currentPlayer: Player;
  gameActive: boolean;
  BOARD_SIZE: number;
  lastMove: Move | null;
}

interface PreviewPosition {
  row: number;
  col: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameBoard,
  onMove,
  currentPlayer,
  gameActive,
  BOARD_SIZE,
  lastMove,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewPosition, setPreviewPosition] =
    useState<PreviewPosition | null>(null);

  // 计算Canvas尺寸
  const getCellSize = (): number => {
    const containerSize = Math.min(
      window.innerWidth * 0.5,
      window.innerHeight * 0.6
    );
    return containerSize / BOARD_SIZE;
  };

  const CELL_SIZE = getCellSize();
  const PIECE_SIZE = CELL_SIZE * 0.8;

  // 绘制棋盘
  const drawBoard = (
    ctx: CanvasRenderingContext2D,
    showPreview: boolean = false
  ): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制网格线
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 1.5;

    for (let i = 0; i < BOARD_SIZE; i++) {
      // 水平线
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();

      // 垂直线
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
    }

    // 绘制天元和星位
    const starPoints = [
      { x: 3, y: 3 },
      { x: 3, y: 11 },
      { x: 7, y: 7 },
      { x: 11, y: 3 },
      { x: 11, y: 11 },
    ];

    starPoints.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x * CELL_SIZE, point.y * CELL_SIZE, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#8B4513";
      ctx.fill();
    });

    // 绘制棋子
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (gameBoard[i][j] !== 0) {
          drawPiece(ctx, i, j, gameBoard[i][j] as Player);
          // 绘制最后落子的高亮效果
          if (lastMove && lastMove.row === i && lastMove.col === j) {
            drawHighlight(ctx, i, j, gameBoard[i][j] as Player);
          }
        }
      }
    }

    // 绘制预览棋子
    if (showPreview && previewPosition && gameActive) {
      const { row, col } = previewPosition;
      if (gameBoard[row][col] === 0) {
        ctx.beginPath();
        ctx.arc(
          col * CELL_SIZE,
          row * CELL_SIZE,
          PIECE_SIZE / 2,
          0,
          Math.PI * 2
        );

        if (currentPlayer === 1) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        }

        ctx.fill();
      }
    }
  };

  // 绘制高亮效果
  const drawHighlight = (
    ctx: CanvasRenderingContext2D,
    row: number,
    col: number,
    player: Player
  ): void => {
    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;

    ctx.beginPath();
    ctx.arc(x, y, PIECE_SIZE / 2 + 4, 0, Math.PI * 2);
    ctx.strokeStyle = player === 1 ? "#FF4444" : "#4444FF";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  // 绘制棋子
  const drawPiece = (
    ctx: CanvasRenderingContext2D,
    row: number,
    col: number,
    player: Player
  ): void => {
    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;

    // 棋子阴影
    ctx.beginPath();
    ctx.arc(x, y, PIECE_SIZE / 2 + 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fill();

    // 棋子本体
    ctx.beginPath();
    ctx.arc(x, y, PIECE_SIZE / 2, 0, Math.PI * 2);

    if (player === 1) {
      // 黑棋 - 渐变效果
      const gradient = ctx.createRadialGradient(
        x - PIECE_SIZE / 6,
        y - PIECE_SIZE / 6,
        PIECE_SIZE / 10,
        x,
        y,
        PIECE_SIZE / 2
      );
      gradient.addColorStop(0, "#555");
      gradient.addColorStop(1, "#000");
      ctx.fillStyle = gradient;
    } else {
      // 白棋 - 渐变效果
      const gradient = ctx.createRadialGradient(
        x - PIECE_SIZE / 6,
        y - PIECE_SIZE / 6,
        PIECE_SIZE / 10,
        x,
        y,
        PIECE_SIZE / 2
      );
      gradient.addColorStop(0, "#fff");
      gradient.addColorStop(1, "#ddd");
      ctx.fillStyle = gradient;
    }

    ctx.fill();

    // 棋子边缘
    ctx.strokeStyle = player === 1 ? "#333" : "#ccc";
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  // 处理点击事件
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!gameActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const col = Math.round(x / CELL_SIZE);
    const row = Math.round(y / CELL_SIZE);

    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
      onMove(row, col);
    }
  };

  // 处理鼠标移动事件
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!gameActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const col = Math.round(x / CELL_SIZE);
    const row = Math.round(y / CELL_SIZE);

    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
      setPreviewPosition({ row, col });
    } else {
      setPreviewPosition(null);
    }
  };

  // 处理鼠标离开事件
  const handleMouseLeave = (): void => {
    setPreviewPosition(null);
  };

  // 重绘棋盘
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawBoard(ctx, true);
  }, [gameBoard, previewPosition, currentPlayer, gameActive]);

  // 设置Canvas尺寸
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CELL_SIZE * (BOARD_SIZE - 1);
    canvas.height = CELL_SIZE * (BOARD_SIZE - 1);
  }, [CELL_SIZE, BOARD_SIZE]);

  return (
    <div
      className="aspect-square bg-board rounded-lg shadow-lg overflow-hidden board-grid"
      style={{
        backgroundSize: `calc(100% / ${BOARD_SIZE - 1}) calc(100% / ${
          BOARD_SIZE - 1
        })`,
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};

export default GameBoard;
