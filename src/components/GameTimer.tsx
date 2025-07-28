import React, { useState } from "react";
import { Player } from "../hooks/useGomoku";
import {
  TimerState,
  TimerConfig,
  TimerMode,
  TIMER_MODE_OPTIONS,
} from "../hooks/useGameTimer";

interface GameTimerProps {
  timerState: TimerState;
  config: TimerConfig;
  currentPlayer: Player;
  gameActive: boolean;
  updateConfig: (newConfig: Partial<TimerConfig>) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  formatTime: (seconds: number) => string;
  isTimeUp: (player: Player) => boolean;
}

const GameTimer: React.FC<GameTimerProps> = ({
  timerState,
  config,
  currentPlayer,
  gameActive,
  updateConfig,
  pauseTimer,
  resumeTimer,
  resetTimer,
  formatTime,
  isTimeUp,
}) => {
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);

  // 计算时间进度条百分比
  const getTimeProgress = (player: Player): number => {
    const playerTimer = player === 1 ? timerState.player1 : timerState.player2;

    switch (config.mode) {
      case "unlimited":
        return 100;
      case "total_time":
      case "fischer":
        return Math.max(0, (playerTimer.totalTime / config.totalTime) * 100);
      case "per_move":
        return Math.max(
          0,
          ((config.moveTime - playerTimer.moveTime) / config.moveTime) * 100
        );
      default:
        return 100;
    }
  };

  // 获取时间显示颜色
  const getTimeColor = (player: Player): string => {
    if (isTimeUp(player)) return "text-red-500";
    if (getTimeProgress(player) < 20) return "text-orange-500";
    return "text-gray-700";
  };

  // 获取进度条颜色
  const getProgressColor = (player: Player): string => {
    if (isTimeUp(player)) return "bg-red-500";
    if (getTimeProgress(player) < 20) return "bg-orange-500";
    return "bg-primary";
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm">
      {/* 计时器标题 */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold flex items-center">
          <i className="fa-solid fa-clock mr-2 text-primary"></i>
          游戏计时
        </h2>
      </div>

      {/* 双方计时显示 */}
      <div className="p-4 space-y-4">
        {/* 黑棋计时 */}
        <div
          className={`p-3 rounded-lg border-2 transition-all ${
            currentPlayer === 1 && gameActive && !timerState.isPaused
              ? "border-primary bg-primary/5"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-black rounded-full mr-2 piece-shadow"></div>
              <span className="font-medium">黑棋</span>
              {currentPlayer === 1 && gameActive && !timerState.isPaused && (
                <i className="fa-solid fa-play ml-2 text-primary animate-pulse"></i>
              )}
            </div>
            <div className={`font-mono text-lg font-bold ${getTimeColor(1)}`}>
              {config.mode === "unlimited"
                ? formatTime(timerState.gameTime)
                : config.mode === "per_move"
                ? formatTime(timerState.player1.moveTime)
                : formatTime(timerState.player1.totalTime)}
            </div>
          </div>

          {config.mode !== "unlimited" && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor(
                  1
                )}`}
                style={{ width: `${getTimeProgress(1)}%` }}
              ></div>
            </div>
          )}

          {config.mode === "per_move" && (
            <div className="text-xs text-gray-500 mt-1">
              总用时: {formatTime(timerState.player1.totalTime)}
            </div>
          )}
        </div>

        {/* 白棋计时 */}
        <div
          className={`p-3 rounded-lg border-2 transition-all ${
            currentPlayer === 2 && gameActive && !timerState.isPaused
              ? "border-primary bg-primary/5"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-white border border-gray-300 rounded-full mr-2 piece-shadow"></div>
              <span className="font-medium">白棋</span>
              {currentPlayer === 2 && gameActive && !timerState.isPaused && (
                <i className="fa-solid fa-play ml-2 text-primary animate-pulse"></i>
              )}
            </div>
            <div className={`font-mono text-lg font-bold ${getTimeColor(2)}`}>
              {config.mode === "unlimited"
                ? formatTime(timerState.gameTime)
                : config.mode === "per_move"
                ? formatTime(timerState.player2.moveTime)
                : formatTime(timerState.player2.totalTime)}
            </div>
          </div>

          {config.mode !== "unlimited" && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor(
                  2
                )}`}
                style={{ width: `${getTimeProgress(2)}%` }}
              ></div>
            </div>
          )}

          {config.mode === "per_move" && (
            <div className="text-xs text-gray-500 mt-1">
              总用时: {formatTime(timerState.player2.totalTime)}
            </div>
          )}
        </div>

        {/* 控制按钮 */}
        <div className="flex gap-2">
          <button
            onClick={timerState.isPaused ? resumeTimer : pauseTimer}
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 px-3 rounded-lg font-medium btn-hover flex items-center justify-center"
            disabled={!gameActive}
          >
            <i
              className={`fa-solid fa-${
                timerState.isPaused ? "play" : "pause"
              } mr-2`}
            ></i>
            {timerState.isPaused ? "继续" : "暂停"}
          </button>
          <button
            onClick={resetTimer}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded-lg font-medium btn-hover flex items-center justify-center"
          >
            <i className="fa-solid fa-refresh mr-2"></i>重置
          </button>
        </div>

        {/* 计时模式配置 */}
        <div className="border-t pt-4">
          <button
            onClick={() => setIsConfigExpanded(!isConfigExpanded)}
            className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-800"
          >
            <span>计时设置</span>
            <i
              className={`fa-solid fa-chevron-${
                isConfigExpanded ? "up" : "down"
              }`}
            ></i>
          </button>

          {isConfigExpanded && (
            <div className="mt-3 space-y-3">
              {/* 计时模式选择 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  计时模式
                </label>
                <div className="space-y-2">
                  {TIMER_MODE_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-2 rounded border cursor-pointer text-sm ${
                        config.mode === option.value
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="timerMode"
                        value={option.value}
                        checked={config.mode === option.value}
                        onChange={(e) =>
                          updateConfig({ mode: e.target.value as TimerMode })
                        }
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">
                          {option.description}
                        </div>
                      </div>
                      {config.mode === option.value && (
                        <i className="fa-solid fa-check text-primary"></i>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* 时间参数设置 */}
              {config.mode !== "unlimited" && (
                <div className="space-y-2">
                  {(config.mode === "total_time" ||
                    config.mode === "fischer") && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        总时间 (分钟)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="180"
                        value={Math.floor(config.totalTime / 60)}
                        onChange={(e) =>
                          updateConfig({
                            totalTime: parseInt(e.target.value) * 60,
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  )}

                  {config.mode === "per_move" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        每步时间 (秒)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="300"
                        value={config.moveTime}
                        onChange={(e) =>
                          updateConfig({ moveTime: parseInt(e.target.value) })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  )}

                  {config.mode === "fischer" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        增量时间 (秒)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={config.increment}
                        onChange={(e) =>
                          updateConfig({ increment: parseInt(e.target.value) })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameTimer;
