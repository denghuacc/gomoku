import { Player } from "../hooks/useGomoku";

interface WinModalProps {
  winner: Player | null;
  isOpen: boolean;
  onNewGame: () => void;
  onClose: () => void;
}

const WinModal: React.FC<WinModalProps> = ({
  winner,
  isOpen,
  onNewGame,
  onClose,
}) => {
  console.log("[WinModal] Render with:", { winner, isOpen });

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      console.log("Backdrop clicked, closing modal"); // 调试日志
      onClose();
    }
  };

  const handleCloseClick = () => {
    console.log("Close button clicked"); // 调试日志
    onClose();
  };

  const handleViewBoardClick = () => {
    console.log("View board button clicked"); // 调试日志
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 transform transition-transform duration-300 relative">
        {/* 关闭按钮 */}
        <button
          onClick={handleCloseClick}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          title="关闭"
        >
          <i className="fa-solid fa-times text-xl"></i>
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-trophy text-3xl text-yellow-500"></i>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {winner === 1 ? "黑棋" : "白棋"}获胜!
          </h2>
          <p className="text-gray-600 mb-6">恭喜您赢得了这场精彩的比赛!</p>

          {/* 操作按钮组 */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={onNewGame}
              className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-medium btn-hover flex items-center justify-center"
            >
              <i className="fa-solid fa-refresh mr-2"></i>
              开始新游戏
            </button>

            <button
              onClick={handleViewBoardClick}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium btn-hover flex items-center justify-center"
            >
              <i className="fa-solid fa-eye mr-2"></i>
              查看棋盘
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            💡 提示：关闭此窗口可以回顾棋局，使用对局回顾功能查看完整对战过程
          </p>
        </div>
      </div>
    </div>
  );
};

export default WinModal;
