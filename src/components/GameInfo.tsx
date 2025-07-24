import { Player } from "../hooks/useGomoku";

interface GameInfoProps {
  currentPlayer: Player;
  gameTime: number;
  moveCount: number;
}

const GameInfo: React.FC<GameInfoProps> = ({
  currentPlayer,
  gameTime,
  moveCount,
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
      <div className="space-y-3">
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
    </div>
  );
};

export default GameInfo;
