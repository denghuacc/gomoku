import React, { useState } from "react";
import { Player } from "../hooks/useGomoku";
import {
  AIConfig,
  AIState,
  AIDifficulty,
  EvaluationMode,
  AI_DIFFICULTY_OPTIONS,
  EVALUATION_MODE_OPTIONS,
} from "../ai/types";

interface AIConfigProps {
  config: AIConfig;
  state: AIState;
  currentPlayer: Player;
  gameActive: boolean;
  updateConfig: (newConfig: Partial<AIConfig>) => void;
  toggleAI: () => void;
  setDifficulty: (difficulty: AIDifficulty) => void;
  setAIPlayer: (player: Player) => void;
  setEvaluationMode: (mode: EvaluationMode) => void;
  resetConfig: () => void;
}

const AIConfigComponent: React.FC<AIConfigProps> = ({
  config,
  state,
  currentPlayer,
  gameActive,
  toggleAI,
  setDifficulty,
  setAIPlayer,
  setEvaluationMode,
  resetConfig,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatThinkingTime = (ms: number): string => {
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm">
      {/* AI 配置标题和折叠按钮 */}
      <div
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <i className="fa-solid fa-robot mr-2 text-primary"></i>
          <h3 className="font-semibold text-gray-800">AI 对手</h3>
          {config.enabled && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
              已启用
            </span>
          )}
        </div>
        <div className="flex items-center">
          {state.isThinking && config.enabled && (
            <div className="flex items-center mr-3">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">思考中...</span>
            </div>
          )}
          <i
            className={`fa-solid fa-chevron-${
              isExpanded ? "up" : "down"
            } text-gray-400`}
          ></i>
        </div>
      </div>

      {/* AI 配置内容 */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-200">
          {/* AI 启用开关 */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              启用 AI 对手
            </label>
            <button
              onClick={toggleAI}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.enabled ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {config.enabled && (
            <>
              {/* AI 玩家选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI 执子颜色
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setAIPlayer(1)}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all ${
                      config.player === 1
                        ? "bg-gray-800 text-white border-gray-800"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <i className="fa-solid fa-circle mr-2"></i>
                    黑棋
                  </button>
                  <button
                    onClick={() => setAIPlayer(2)}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all ${
                      config.player === 2
                        ? "bg-gray-200 text-gray-800 border-gray-300"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <i className="fa-regular fa-circle mr-2"></i>
                    白棋
                  </button>
                </div>
              </div>

              {/* 难度选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI 难度
                </label>
                <div className="space-y-2">
                  {AI_DIFFICULTY_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        value={option.value}
                        checked={config.difficulty === option.value}
                        onChange={() => setDifficulty(option.value)}
                        className="mr-3 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">
                            {option.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            深度: {option.maxDepth} | 思考:{" "}
                            {formatThinkingTime(option.thinkingTime)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 评估模式 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  战术风格
                </label>
                <div className="space-y-2">
                  {EVALUATION_MODE_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <input
                        type="radio"
                        name="evaluationMode"
                        value={option.value}
                        checked={config.evaluationMode === option.value}
                        onChange={() => setEvaluationMode(option.value)}
                        className="mr-3 text-primary focus:ring-primary"
                      />
                      <div>
                        <span className="font-medium text-gray-800">
                          {option.label}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* AI 状态信息 */}
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  AI 状态
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">当前轮次:</span>
                    <span
                      className={`font-medium ${
                        config.player === currentPlayer && gameActive
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {config.player === currentPlayer && gameActive
                        ? "AI 回合"
                        : "等待中"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">状态:</span>
                    <span
                      className={`font-medium ${
                        state.isThinking ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {state.isThinking ? "思考中" : "待机"}
                    </span>
                  </div>
                  {state.lastThinkingTime > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">上次思考时间:</span>
                      <span className="font-medium text-gray-800">
                        {formatThinkingTime(state.lastThinkingTime)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 重置按钮 */}
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={resetConfig}
                  className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <i className="fa-solid fa-refresh mr-2"></i>
                  重置 AI 配置
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIConfigComponent;
