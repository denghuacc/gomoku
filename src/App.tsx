import { useGomoku } from "./hooks/useGomoku";
import GameBoard from "./components/GameBoard";
import GameInfo from "./components/GameInfo";
import GameRules from "./components/GameRules";
import GameStatus from "./components/GameStatus";
import WinModal from "./components/WinModal";

function App(): JSX.Element {
  const {
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
  } = useGomoku();

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* 头部 */}
        <div className="bg-primary text-white p-6 text-center">
          <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold">五子棋</h1>
          <p className="text-secondary mt-2">经典对弈游戏</p>
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
          {/* 游戏区域 */}
          <div className="flex-1 relative">
            <GameBoard
              gameBoard={gameBoard}
              onMove={makeMove}
              currentPlayer={currentPlayer}
              gameActive={gameActive}
              BOARD_SIZE={BOARD_SIZE}
              lastMove={lastMove}
            />

            <GameStatus
              gameActive={gameActive}
              currentPlayer={currentPlayer}
              winner={winner}
            />
          </div>

          {/* 游戏控制和信息 */}
          <div className="w-full md:w-80 flex flex-col gap-6">
            <GameInfo
              currentPlayer={currentPlayer}
              gameTime={gameTime}
              moveCount={moveHistory.length}
            />

            <GameRules />

            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium btn-hover flex items-center justify-center"
              >
                <i className="fa-solid fa-refresh mr-2"></i>重新开始
              </button>
              <button
                onClick={undoMove}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium btn-hover flex items-center justify-center"
                disabled={moveHistory.length === 0 || !gameActive}
              >
                <i className="fa-solid fa-undo mr-2"></i>悔棋
              </button>
            </div>
          </div>
        </div>

        {/* 底部 */}
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-500">
          <p>© 2025 五子棋游戏 | 基于 React + Vite 构建</p>
        </div>
      </div>

      {/* 胜利提示模态框 */}
      <WinModal winner={winner} isOpen={!!winner} onNewGame={resetGame} />
    </div>
  );
}

export default App;
