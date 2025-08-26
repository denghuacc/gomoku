import { useRef, useEffect, useState } from "react";
import { GameBoard as GameBoardType, Player, Move } from "../hooks/useGomoku";

interface GameBoardProps {
  gameBoard: GameBoardType;
  onMove: (row: number, col: number) => boolean;
  currentPlayer: Player;
  gameActive: boolean;
  BOARD_SIZE: number;
  lastMove: Move | null;
  moveHistory: Move[]; // 添加落子历史数组
  reviewMode: boolean; // 添加回顾模式标志
  currentReviewMove: number; // 添加当前回顾的步数
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
  moveHistory,
  reviewMode,
  currentReviewMove,
}) => {
  // 获取指定位置的落子顺序
  const getMoveNumber = (row: number, col: number): number | null => {
    const moveIndex = moveHistory.findIndex(
      (move) => move.row === row && move.col === col
    );
    return moveIndex === -1 ? null : moveIndex + 1;
  };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewPosition, setPreviewPosition] =
    useState<PreviewPosition | null>(null);

  // 生成坐标标签 - 对应15根线
  const generateColumnLabels = (): string[] => {
    return Array.from(
      { length: BOARD_SIZE },
      (_, i) => String.fromCharCode(65 + i) // A, B, C, ..., O (15个字母)
    );
  };

  const generateRowLabels = (): string[] => {
    return Array.from(
      { length: BOARD_SIZE },
      (_, i) => (i + 1).toString() // 1, 2, 3, ..., 15 (15个数字)
    );
  };

  // 计算Canvas尺寸 - 调整为原来的尺寸以保持布局
  const getCellSize = (): number => {
    const containerSize = Math.min(
      window.innerWidth * 0.5,
      window.innerHeight * 0.6
    );
    // 调整计算：让最终Canvas尺寸和之前15x14的尺寸相当
    return containerSize / (BOARD_SIZE + 1); // 除以16而不是15，让棋盘稍微小一点
  };

  const CELL_SIZE = getCellSize();
  const PIECE_SIZE = CELL_SIZE * 0.85; // 稍微增大棋子相对尺寸，从0.8改为0.85
  // Canvas实际尺寸：需要为边缘棋子预留空间
  const CANVAS_SIZE = CELL_SIZE * BOARD_SIZE;
  const GRID_OFFSET = CELL_SIZE / 2; // 网格起始偏移

  // 绘制棋盘
  const drawBoard = (
    ctx: CanvasRenderingContext2D,
    showPreview: boolean = false
  ): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制网格线 - 绘制 BOARD_SIZE+1 根线（包括边界）
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 1.5;

    // 绘制 BOARD_SIZE+1 根线（0到BOARD_SIZE，总共BOARD_SIZE+1根）
    for (let i = 0; i <= BOARD_SIZE; i++) {
      const pos = GRID_OFFSET + i * CELL_SIZE;

      // 水平线
      ctx.beginPath();
      ctx.moveTo(GRID_OFFSET, pos);
      ctx.lineTo(canvas.width - GRID_OFFSET, pos);
      ctx.stroke();

      // 垂直线
      ctx.beginPath();
      ctx.moveTo(pos, GRID_OFFSET);
      ctx.lineTo(pos, canvas.height - GRID_OFFSET);
      ctx.stroke();
    }

    // 绘制天元和星位（根据棋盘大小动态调整）
    let starPoints: { x: number; y: number }[] = [];

    if (BOARD_SIZE === 13) {
      starPoints = [
        { x: 3, y: 3 },
        { x: 3, y: 9 },
        { x: 6, y: 6 },
        { x: 9, y: 3 },
        { x: 9, y: 9 },
      ];
    } else if (BOARD_SIZE === 15) {
      starPoints = [
        { x: 3, y: 3 },
        { x: 3, y: 11 },
        { x: 7, y: 7 },
        { x: 11, y: 3 },
        { x: 11, y: 11 },
      ];
    } else if (BOARD_SIZE === 19) {
      starPoints = [
        { x: 3, y: 3 },
        { x: 3, y: 9 },
        { x: 3, y: 15 },
        { x: 9, y: 3 },
        { x: 9, y: 9 },
        { x: 9, y: 15 },
        { x: 15, y: 3 },
        { x: 15, y: 9 },
        { x: 15, y: 15 },
      ];
    }

    starPoints.forEach((point) => {
      ctx.beginPath();
      ctx.arc(
        GRID_OFFSET + point.x * CELL_SIZE,
        GRID_OFFSET + point.y * CELL_SIZE,
        4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "#8B4513";
      ctx.fill();
    });

    // 绘制棋子
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (gameBoard[i][j] !== 0) {
          drawPiece(ctx, i, j, gameBoard[i][j] as Player);
          // 绘制最后落子或当前回顾落子的高亮效果
          if (
            (!reviewMode &&
              lastMove &&
              lastMove.row === i &&
              lastMove.col === j) || // 普通模式下高亮最后落子
            (reviewMode &&
              moveHistory[currentReviewMove - 1]?.row === i &&
              moveHistory[currentReviewMove - 1]?.col === j) // 回顾模式下高亮当前回顾的落子
          ) {
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
          GRID_OFFSET + col * CELL_SIZE,
          GRID_OFFSET + row * CELL_SIZE,
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
    const x = GRID_OFFSET + col * CELL_SIZE;
    const y = GRID_OFFSET + row * CELL_SIZE;

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
    const x = GRID_OFFSET + col * CELL_SIZE;
    const y = GRID_OFFSET + row * CELL_SIZE;

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

    // 只在回顾模式下绘制落子顺序编号
    if (reviewMode) {
      const moveNumber = getMoveNumber(row, col);
      if (moveNumber !== null) {
        ctx.font = `${PIECE_SIZE * 0.4}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = player === 1 ? "#fff" : "#000";
        ctx.fillText(moveNumber.toString(), x, y);
      }
    }
  };

  // 处理点击事件
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!gameActive || reviewMode) return; // 在回顾模式或游戏非活跃状态下禁止落子

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // 调整点击检测：考虑网格偏移
    const col = Math.round((x - GRID_OFFSET) / CELL_SIZE);
    const row = Math.round((y - GRID_OFFSET) / CELL_SIZE);

    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
      onMove(row, col);
    }
  };

  // 处理鼠标移动事件
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!gameActive || reviewMode) return; // 在回顾模式或游戏非活跃状态下禁止预览

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // 调整鼠标移动检测：考虑网格偏移
    const col = Math.round((x - GRID_OFFSET) / CELL_SIZE);
    const row = Math.round((y - GRID_OFFSET) / CELL_SIZE);

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
  }, [gameBoard, previewPosition, currentPlayer, gameActive, reviewMode]);

  // 设置Canvas尺寸 - 修正为完整尺寸
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
  }, [CANVAS_SIZE]);

  const columnLabels = generateColumnLabels();
  const rowLabels = generateRowLabels();

  return (
    <div className="flex flex-col items-center">
      {/* 顶部坐标标签 */}
      <div className="flex items-center mb-2">
        <div className="w-8"></div> {/* 左上角空白 */}
        <div className="flex" style={{ width: CANVAS_SIZE }}>
          {columnLabels.map((label) => (
            <div
              key={label}
              className="flex items-center justify-center text-sm font-medium text-gray-600"
              style={{
                width: CELL_SIZE,
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="w-8"></div> {/* 右上角空白 */}
      </div>

      {/* 棋盘主体区域 */}
      <div className="flex items-center">
        {/* 左侧坐标标签 */}
        <div className="flex flex-col mr-2" style={{ height: CANVAS_SIZE }}>
          {rowLabels.map((label) => (
            <div
              key={label}
              className="flex items-center justify-center text-sm font-medium text-gray-600"
              style={{
                height: CELL_SIZE,
                width: "2rem",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* 棋盘Canvas */}
        <div
          className="bg-board rounded-lg shadow-lg overflow-hidden"
          style={{
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
          }}
        >
          <canvas
            ref={canvasRef}
            className={`w-full h-full ${
              reviewMode ? "cursor-default" : "cursor-pointer"
            }`}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        </div>

        {/* 右侧坐标标签 */}
        <div className="flex flex-col ml-2" style={{ height: CANVAS_SIZE }}>
          {rowLabels.map((label) => (
            <div
              key={`right-${label}`}
              className="flex items-center justify-center text-sm font-medium text-gray-600"
              style={{
                height: CELL_SIZE,
                width: "2rem",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* 底部坐标标签 */}
      <div className="flex items-center mt-2">
        <div className="w-8"></div> {/* 左下角空白 */}
        <div className="flex" style={{ width: CANVAS_SIZE }}>
          {columnLabels.map((label) => (
            <div
              key={`bottom-${label}`}
              className="flex items-center justify-center text-sm font-medium text-gray-600"
              style={{
                width: CELL_SIZE,
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="w-8"></div> {/* 右下角空白 */}
      </div>
    </div>
  );
};

export default GameBoard;
