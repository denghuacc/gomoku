import React, { useState } from "react";
import {
  type GameConfig as GameConfigType,
  BoardSize,
  PlayerType,
  BOARD_SIZE_OPTIONS,
  WIN_CONDITION_OPTIONS,
  FIRST_PLAYER_OPTIONS,
} from "../hooks/useGameConfig";

interface GameConfigProps {
  config: GameConfigType;
  setBoardSize: (size: BoardSize) => void;
  setWinCondition: (condition: number) => void;
  setFirstPlayer: (player: PlayerType) => void;
  setAllowUndo: (allow: boolean) => void;
  resetConfig: () => void;
  onApplyConfig?: () => void; // 应用配置后的回调
}

const GameConfig: React.FC<GameConfigProps> = ({
  config,
  setBoardSize,
  setWinCondition,
  setFirstPlayer,
  setAllowUndo,
  resetConfig,
  onApplyConfig,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApplyConfig = () => {
    if (onApplyConfig) {
      onApplyConfig();
    }
    setIsExpanded(false);
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm">
      {/* 配置标题和折叠按钮 */}
      <div
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold flex items-center">
          <i className="fa-solid fa-cog mr-2 text-primary"></i>
          游戏设置
        </h2>
        <i
          className={`fa-solid fa-chevron-${
            isExpanded ? "up" : "down"
          } text-gray-400 transition-transform`}
        ></i>
      </div>

      {/* 配置内容 */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="space-y-4 pt-4">
            {/* 棋盘大小配置 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                棋盘规格
              </label>
              <div className="grid grid-cols-1 gap-2">
                {BOARD_SIZE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      config.boardSize === option.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="boardSize"
                      value={option.value}
                      checked={config.boardSize === option.value}
                      onChange={() => setBoardSize(option.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">
                        {option.description}
                      </div>
                    </div>
                    {config.boardSize === option.value && (
                      <i className="fa-solid fa-check text-primary"></i>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* 胜利条件配置 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                胜利条件
              </label>
              <div className="grid grid-cols-1 gap-2">
                {WIN_CONDITION_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      config.winCondition === option.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="winCondition"
                      value={option.value}
                      checked={config.winCondition === option.value}
                      onChange={() => setWinCondition(option.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">
                        {option.description}
                      </div>
                    </div>
                    {config.winCondition === option.value && (
                      <i className="fa-solid fa-check text-primary"></i>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* 先手选择配置 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                开局设定
              </label>
              <div className="grid grid-cols-1 gap-2">
                {FIRST_PLAYER_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      config.firstPlayer === option.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="firstPlayer"
                      value={option.value}
                      checked={config.firstPlayer === option.value}
                      onChange={() => setFirstPlayer(option.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center flex-1">
                      <div
                        className={`w-6 h-6 rounded-full mr-3 piece-shadow ${
                          option.value === 1
                            ? "bg-black"
                            : "bg-white border border-gray-300"
                        }`}
                      ></div>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">
                          {option.description}
                        </div>
                      </div>
                    </div>
                    {config.firstPlayer === option.value && (
                      <i className="fa-solid fa-check text-primary"></i>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* 其他选项 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                游戏选项
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300">
                <div>
                  <div className="font-medium">允许悔棋</div>
                  <div className="text-sm text-gray-500">
                    游戏过程中可以撤销上一步
                  </div>
                </div>
                <button
                  onClick={() => setAllowUndo(!config.allowUndo)}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ${
                    config.allowUndo ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      config.allowUndo ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  ></div>
                </button>
              </label>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleApplyConfig}
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium btn-hover flex items-center justify-center"
              >
                <i className="fa-solid fa-check mr-2"></i>应用设置
              </button>
              <button
                onClick={resetConfig}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium btn-hover flex items-center justify-center"
              >
                <i className="fa-solid fa-refresh mr-2"></i>重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameConfig;
