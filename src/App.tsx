import { useGomoku, Player } from "./hooks/useGomoku";
import { useGameConfig } from "./hooks/useGameConfig";
import { useGameTimer } from "./hooks/useGameTimer";
import GameBoard from "./components/GameBoard";
import GameStatus from "./components/GameStatus";
import GameTabs from "./components/GameTabs";
import WinModal from "./components/WinModal";
import { useEffect, useState } from "react";

function App(): JSX.Element {
  // 模态框状态管理 - 使用ref来跟踪上一次的winner状态
  const [showWinModal, setShowWinModal] = useState(false);
  const [lastWinnerShown, setLastWinnerShown] = useState<Player | null>(null);

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
    // 回顾功能相关
    reviewMode,
    setReviewMode,
    currentReviewMove,
    setCurrentReviewMove,
    autoPlayInterval,
    setAutoPlayInterval,
    // AI 相关
    aiConfig,
    aiState,
    updateAIConfig,
    toggleAI,
    setAIDifficulty,
    setAIPlayer,
    setAIEvaluationMode,
    resetAIConfig,
  } = useGomoku(config);

  // 计时器系统
  const {
    timerState,
    config: timerConfig,
    updateConfig: updateTimerConfig,
    pauseTimer,
    resumeTimer,
    switchPlayer: switchTimerPlayer,
    resetTimer: resetGameTimer,
    isTimeUp,
    formatTime,
  } = useGameTimer();

  // 同步计时器玩家切换
  useEffect(() => {
    if (gameActive) {
      switchTimerPlayer(currentPlayer);
    }
  }, [currentPlayer, gameActive, switchTimerPlayer]);

  // 监听游戏获胜状态，只在新的获胜者出现时显示模态框
  useEffect(() => {
    if (winner && winner !== lastWinnerShown) {
      console.log("[App] New winner detected, showing modal:", winner);
      setShowWinModal(true);
      setLastWinnerShown(winner);
    } else if (!winner) {
      // 游戏重置时清除记录
      setLastWinnerShown(null);
      setShowWinModal(false);
    }
  }, [winner, lastWinnerShown]);

  // 应用配置并重新开始游戏
  const handleApplyConfig = () => {
    applyConfig(config);
  };

  // 关闭获胜模态框
  const handleCloseWinModal = () => {
    console.log("[App] Closing win modal, current state:", {
      winner,
      showWinModal,
    });
    setShowWinModal(false);
  };

  // 开始新游戏并关闭模态框
  const handleNewGame = () => {
    console.log("Starting new game"); // 调试日志
    setShowWinModal(false);
    setLastWinnerShown(null); // 重置获胜者记录
    resetGame();
  };

  // 处理回顾模式
  const handleReviewMove = (moveIndex: number) => {
    setCurrentReviewMove(moveIndex);
  };

  const handleToggleReviewMode = () => {
    setReviewMode(!reviewMode);
  };

  const handleToggleAutoPlay = () => {
    if (autoPlayInterval !== null) {
      setAutoPlayInterval(null);
    } else {
      setAutoPlayInterval(1000); // 1秒间隔
    }
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
              moveHistory={moveHistory}
              reviewMode={reviewMode}
              currentReviewMove={currentReviewMove}
            />

            <GameStatus
              gameActive={gameActive}
              currentPlayer={currentPlayer}
              winner={winner}
            />
          </div>

          {/* 游戏控制和信息 */}
          <div className="w-full md:w-80 flex flex-col gap-6">
            {/* 游戏操作按钮 */}
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

            <GameTabs
              // GameInfo props
              currentPlayer={currentPlayer}
              gameTime={gameTime}
              moveCount={moveHistory.length}
              audioEnabled={audioEnabled}
              volume={volume}
              toggleAudio={toggleAudio}
              setVolume={setVolume}
              // GameTimer props
              timerState={timerState}
              timerConfig={timerConfig}
              gameActive={gameActive}
              updateTimerConfig={updateTimerConfig}
              pauseTimer={pauseTimer}
              resumeTimer={resumeTimer}
              resetTimer={resetGameTimer}
              formatTime={formatTime}
              isTimeUp={isTimeUp}
              // GameConfig props
              config={config}
              setBoardSize={setBoardSize}
              setWinCondition={setWinCondition}
              setFirstPlayer={setFirstPlayer}
              setAllowUndo={setAllowUndo}
              resetConfig={resetConfig}
              onApplyConfig={handleApplyConfig}
              // GameReview props
              moveHistory={moveHistory}
              reviewMode={reviewMode}
              currentReviewMove={currentReviewMove}
              autoPlayInterval={autoPlayInterval}
              onReviewMove={handleReviewMove}
              onToggleReviewMode={handleToggleReviewMode}
              onToggleAutoPlay={handleToggleAutoPlay}
              // AI props
              aiConfig={aiConfig}
              aiState={aiState}
              updateAIConfig={updateAIConfig}
              toggleAI={toggleAI}
              setAIDifficulty={setAIDifficulty}
              setAIPlayer={setAIPlayer}
              setAIEvaluationMode={setAIEvaluationMode}
              resetAIConfig={resetAIConfig}
            />
          </div>
        </div>

        {/* 底部 */}
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-500">
          <p>© 2025 五子棋游戏 | 经典策略对弈</p>
        </div>
      </div>

      {/* 胜利提示模态框 */}
      <WinModal
        winner={winner}
        isOpen={showWinModal}
        onNewGame={handleNewGame}
        onClose={handleCloseWinModal}
      />

      {/* 调试信息 */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 bg-black text-white p-2 rounded text-xs">
          Winner: {winner ? `Player ${winner}` : "None"}, Modal:{" "}
          {showWinModal ? "Open" : "Closed"}
        </div>
      )}
    </div>
  );
}

export default App;
