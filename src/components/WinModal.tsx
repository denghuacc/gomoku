import { Player } from "../hooks/useGomoku";

interface WinModalProps {
  winner: Player | null;
  isOpen: boolean;
  onNewGame: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ winner, isOpen, onNewGame }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 transform transition-transform duration-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-trophy text-3xl text-yellow-500"></i>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {winner === 1 ? "黑棋" : "白棋"}获胜!
          </h2>
          <p className="text-gray-600 mb-6">恭喜您赢得了这场精彩的比赛!</p>
          <button
            onClick={onNewGame}
            className="bg-primary hover:bg-primary/90 text-white py-3 px-8 rounded-lg font-medium btn-hover"
          >
            开始新游戏
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;
