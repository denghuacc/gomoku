import { Player } from "../hooks/useGomoku";

interface GameInfoProps {
  currentPlayer: Player;
  gameTime: number;
  moveCount: number;
  audioEnabled: boolean;
  volume: number;
  toggleAudio: () => void;
  setVolume: (volume: number) => void;
}

const GameInfo: React.FC<GameInfoProps> = ({
  currentPlayer,
  gameTime,
  moveCount,
  audioEnabled,
  volume,
  toggleAudio,
  setVolume,
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <i className="fa-solid fa-info-circle mr-2 text-primary"></i>游戏信息
      </h2>

      {/* 游戏状态信息 */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">当前回合</span>
          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full mr-2 piece-shadow ${
                currentPlayer === 1
                  ? "bg-black"
                  : "bg-white border border-gray-300"
              }`}
            ></div>
            <span>{currentPlayer === 1 ? "黑棋" : "白棋"}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">游戏时间</span>
          <span className="font-mono">{formatTime(gameTime)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">步数</span>
          <span>{moveCount}</span>
        </div>
      </div>

      {/* 音效控制 */}
      <div className="border-t pt-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600">音效</span>
          <button
            onClick={toggleAudio}
            className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ${
              audioEnabled ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                audioEnabled ? "translate-x-6" : "translate-x-0.5"
              }`}
            ></div>
          </button>
        </div>

        {audioEnabled && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">音量</span>
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-volume-down text-gray-400 text-sm"></i>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={e => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                  console.log("Volume changed to:", newVolume); // 调试日志
                }}
                className="w-16 h-1 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                    volume * 100
                  }%, #E5E7EB ${volume * 100}%, #E5E7EB 100%)`,
                }}
              />
              <i className="fa-solid fa-volume-up text-gray-400 text-sm"></i>
              <span className="text-xs text-gray-500 ml-1">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 游戏规则 */}
      <div className="border-t pt-4">
        <h3 className="text-base font-medium mb-3 flex items-center">
          <i className="fa-solid fa-crown mr-2 text-primary"></i>游戏规则
        </h3>
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
    </div>
  );
};

export default GameInfo;
