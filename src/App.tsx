import { useGomoku } from "./hooks/useGomoku";
import { useGameConfig } from "./hooks/useGameConfig";
import GameBoard from "./components/GameBoard";
import GameInfo from "./components/GameInfo";
import GameRules from "./components/GameRules";
import GameStatus from "./components/GameStatus";
import GameConfig from "./components/GameConfig";
import WinModal from "./components/WinModal";

function App(): JSX.Element {
  // 游戏配置
  const {
    config,
    setBoardSize,
    setWinCondition,
    setFirstPlayer,
    setAllowUndo,
    resetConfig,
  } = useGameConfig();

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
    audioEnabled,
    volume,
    toggleAudio,
    setVolume,
    applyConfig,
  } = useGomoku(config);

  // 应用配置并重新开始游戏
  const handleApplyConfig = () => {
    applyConfig(config);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div
        className="w-full bg-white rounded-2xl shadow-xl overflow-hidden"
        style={{ maxWidth: "1000px" }}
      >
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
              audioEnabled={audioEnabled}
              volume={volume}
              toggleAudio={toggleAudio}
              setVolume={setVolume}
            />

            <GameConfig
              config={config}
              setBoardSize={setBoardSize}
              setWinCondition={setWinCondition}
              setFirstPlayer={setFirstPlayer}
              setAllowUndo={setAllowUndo}
              resetConfig={resetConfig}
              onApplyConfig={handleApplyConfig}
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
                className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all ${
                  !config.allowUndo
                    ? "bg-red-100 text-red-400 cursor-not-allowed"
                    : moveHistory.length === 0 || !gameActive
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700 btn-hover"
                }`}
                disabled={
                  moveHistory.length === 0 || !gameActive || !config.allowUndo
                }
                title={
                  !config.allowUndo
                    ? "悔棋功能已在游戏设置中禁用"
                    : moveHistory.length === 0
                    ? "没有可悔棋的步数"
                    : !gameActive
                    ? "游戏已结束"
                    : "撤销上一步棋"
                }
              >
                <i
                  className={`fa-solid ${
                    !config.allowUndo ? "fa-ban" : "fa-undo"
                  } mr-2`}
                ></i>
                {!config.allowUndo ? "禁止悔棋" : "悔棋"}
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
