import { Player } from "../hooks/useGomoku";

interface GameStatusProps {
  gameActive: boolean;
  currentPlayer: Player;
  winner: Player | null;
}

const GameStatus: React.FC<GameStatusProps> = ({
  gameActive,
  currentPlayer,
  winner,
}) => {
  const getStatusText = (): string => {
    if (winner) {
      return `游戏结束 - ${winner === 1 ? "黑棋" : "白棋"}获胜!`;
    }
    if (!gameActive) {
      return "游戏结束 - 平局!";
    }
    return `游戏进行中 - ${currentPlayer === 1 ? "黑棋" : "白棋"}回合`;
  };

  return (
    <div className="mt-4 p-3 bg-secondary/20 rounded-lg text-center">
      <p className="font-medium">{getStatusText()}</p>
    </div>
  );
};

export default GameStatus;
