import { useState, useCallback, useEffect } from "react";

// 棋盘大小选项
export type BoardSize = 13 | 15 | 19;

// 玩家类型
export type PlayerType = 1 | 2; // 1: 黑棋, 2: 白棋

// 游戏配置接口
export interface GameConfig {
  boardSize: BoardSize;
  winCondition: number; // 胜利所需连子数
  firstPlayer: PlayerType; // 先手玩家
  allowUndo: boolean; // 是否允许悔棋
}

// 默认配置
const DEFAULT_CONFIG: GameConfig = {
  boardSize: 15,
  winCondition: 5,
  firstPlayer: 1, // 黑棋先手
  allowUndo: true,
};

// 配置选项
export const BOARD_SIZE_OPTIONS: {
  value: BoardSize;
  label: string;
  description: string;
}[] = [
  { value: 13, label: "13×13", description: "入门练习" },
  { value: 15, label: "15×15", description: "标准对局" },
  { value: 19, label: "19×19", description: "专业比赛" },
];

export const WIN_CONDITION_OPTIONS: {
  value: number;
  label: string;
  description: string;
}[] = [
  { value: 4, label: "四子连线", description: "快速游戏" },
  { value: 5, label: "五子连线", description: "经典规则" },
  { value: 6, label: "六子连线", description: "挑战模式" },
];

export const FIRST_PLAYER_OPTIONS: {
  value: PlayerType;
  label: string;
  description: string;
}[] = [
  { value: 1, label: "执黑先手", description: "传统开局" },
  { value: 2, label: "执白先手", description: "变化开局" },
];

interface UseGameConfigReturn {
  config: GameConfig;
  updateConfig: (newConfig: Partial<GameConfig>) => void;
  resetConfig: () => void;
  setBoardSize: (size: BoardSize) => void;
  setWinCondition: (condition: number) => void;
  setFirstPlayer: (player: PlayerType) => void;
  setAllowUndo: (allow: boolean) => void;
}

export const useGameConfig = (): UseGameConfigReturn => {
  const [config, setConfig] = useState<GameConfig>(() => {
    const saved = localStorage.getItem("gomoku-game-config");
    return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
  });

  // 保存配置到本地存储
  useEffect(() => {
    localStorage.setItem("gomoku-game-config", JSON.stringify(config));
  }, [config]);

  // 更新配置
  const updateConfig = useCallback((newConfig: Partial<GameConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  // 重置配置
  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, []);

  // 设置棋盘大小
  const setBoardSize = useCallback(
    (size: BoardSize) => {
      updateConfig({ boardSize: size });
    },
    [updateConfig]
  );

  // 设置胜利条件
  const setWinCondition = useCallback(
    (condition: number) => {
      updateConfig({ winCondition: condition });
    },
    [updateConfig]
  );

  // 设置先手玩家
  const setFirstPlayer = useCallback(
    (player: PlayerType) => {
      updateConfig({ firstPlayer: player });
    },
    [updateConfig]
  );

  // 设置是否允许悔棋
  const setAllowUndo = useCallback(
    (allow: boolean) => {
      updateConfig({ allowUndo: allow });
    },
    [updateConfig]
  );

  return {
    config,
    updateConfig,
    resetConfig,
    setBoardSize,
    setWinCondition,
    setFirstPlayer,
    setAllowUndo,
  };
};
