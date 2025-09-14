import React from "react";
import type { Move } from "../hooks/useGomoku";

interface GameReviewProps {
  moveHistory: Move[];
  reviewMode: boolean;
  onReviewMove: (moveIndex: number) => void;
  currentReviewMove: number;
  onToggleReviewMode: () => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
}

export const GameReview: React.FC<GameReviewProps> = ({
  moveHistory,
  reviewMode,
  onReviewMove,
  currentReviewMove,
  onToggleReviewMode,
  isAutoPlaying,
  onToggleAutoPlay,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-5 shadow-sm mt-4">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <i className="fa-solid fa-clock-rotate-left mr-2 text-primary"></i>
        对局回顾
      </h2>
      <div className="space-y-3">
        {/* 回顾控制按钮 */}
        <div className="flex items-center justify-between">
          <button
            onClick={onToggleReviewMode}
            className={`px-3 py-1 rounded ${
              reviewMode ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
            }`}
            title={reviewMode ? "退出回顾模式" : "进入回顾模式"}
          >
            <i
              className={`fa-solid fa-${reviewMode ? "xmark" : "eye"} mr-2`}
            ></i>
            {reviewMode ? "退出回顾" : "开始回顾"}
          </button>
          {reviewMode && (
            <button
              onClick={onToggleAutoPlay}
              className={`px-3 py-1 rounded ${
                isAutoPlaying
                  ? "bg-red-500 text-white"
                  : "bg-primary text-white"
              }`}
              title={isAutoPlaying ? "停止自动播放" : "开始自动播放"}
            >
              <i
                className={`fa-solid fa-${
                  isAutoPlaying ? "stop" : "play"
                } mr-2`}
              ></i>
              {isAutoPlaying ? "停止播放" : "自动播放"}
            </button>
          )}
        </div>

        {/* 回顾进度条和控制按钮 */}
        {reviewMode && moveHistory.length > 0 && (
          <>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onReviewMove(0)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                title="第一步"
                disabled={currentReviewMove === 0}
              >
                <i className="fa-solid fa-backward-fast"></i>
              </button>
              <button
                onClick={() => onReviewMove(Math.max(0, currentReviewMove - 1))}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                title="上一步"
                disabled={currentReviewMove === 0}
              >
                <i className="fa-solid fa-backward-step"></i>
              </button>
              <div className="flex-1">
                <input
                  type="range"
                  min={0}
                  max={moveHistory.length}
                  value={currentReviewMove}
                  onChange={e => onReviewMove(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <button
                onClick={() =>
                  onReviewMove(
                    Math.min(moveHistory.length, currentReviewMove + 1)
                  )
                }
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                title="下一步"
                disabled={currentReviewMove === moveHistory.length}
              >
                <i className="fa-solid fa-forward-step"></i>
              </button>
              <button
                onClick={() => onReviewMove(moveHistory.length)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                title="最后一步"
                disabled={currentReviewMove === moveHistory.length}
              >
                <i className="fa-solid fa-forward-fast"></i>
              </button>
            </div>

            {/* 当前回合信息 */}
            <div className="text-center text-gray-600">
              第 {currentReviewMove} / {moveHistory.length} 手
              {currentReviewMove > 0 && (
                <span className="ml-2">
                  {`[${String.fromCharCode(
                    65 + moveHistory[currentReviewMove - 1].col
                  )}${moveHistory[currentReviewMove - 1].row + 1}] - ${
                    moveHistory[currentReviewMove - 1].player === 1
                      ? "黑棋"
                      : "白棋"
                  }`}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
