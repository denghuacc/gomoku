import React from "react";

const GameRules: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <i className="fa-solid fa-crown mr-2 text-primary"></i>游戏规则
      </h2>
      <ul className="text-sm text-gray-600 space-y-2">
        <li className="flex items-start">
          <i className="fa-solid fa-circle text-xs mt-1.5 mr-2 text-primary"></i>
          <span>黑棋和白棋轮流在棋盘上落子</span>
        </li>
        <li className="flex items-start">
          <i className="fa-solid fa-circle text-xs mt-1.5 mr-2 text-primary"></i>
          <span>先在横、竖或斜方向形成五子连线者获胜</span>
        </li>
        <li className="flex items-start">
          <i className="fa-solid fa-circle text-xs mt-1.5 mr-2 text-primary"></i>
          <span>点击棋盘上的交叉点放置棋子</span>
        </li>
      </ul>
    </div>
  );
};

export default GameRules;
