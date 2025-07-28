import { useState, useCallback, useRef, useEffect } from "react";
import { Player } from "./useGomoku";

// 计时模式
export type TimerMode = "unlimited" | "total_time" | "per_move" | "fischer";

// 计时器配置
export interface TimerConfig {
  mode: TimerMode;
  totalTime: number; // 总时间限制（秒）
  moveTime: number; // 每步时间限制（秒）
  increment: number; // 费舍尔模式增量（秒）
}

// 玩家计时信息
export interface PlayerTimer {
  totalTime: number; // 剩余总时间
  moveTime: number; // 当前步骤已用时间
  isActive: boolean; // 是否正在计时
}

// 计时器状态
export interface TimerState {
  player1: PlayerTimer; // 黑棋计时
  player2: PlayerTimer; // 白棋计时
  isPaused: boolean; // 是否暂停
  gameTime: number; // 游戏总时间
}

// 默认配置
const DEFAULT_CONFIG: TimerConfig = {
  mode: "unlimited",
  totalTime: 30 * 60, // 30分钟
  moveTime: 30, // 30秒每步
  increment: 10, // 10秒增量
};

// 计时模式选项
export const TIMER_MODE_OPTIONS: {
  value: TimerMode;
  label: string;
  description: string;
}[] = [
  { value: "unlimited", label: "无限时间", description: "不限制游戏时间" },
  { value: "total_time", label: "总时间制", description: "每位玩家总时间限制" },
  { value: "per_move", label: "步时制", description: "每步固定时间限制" },
  { value: "fischer", label: "费舍尔制", description: "每步后增加时间" },
];

interface UseGameTimerReturn {
  timerState: TimerState;
  config: TimerConfig;
  updateConfig: (newConfig: Partial<TimerConfig>) => void;
  startTimer: (currentPlayer: Player) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  switchPlayer: (newPlayer: Player) => void;
  resetTimer: () => void;
  isTimeUp: (player: Player) => boolean;
  formatTime: (seconds: number) => string;
}

export const useGameTimer = (
  initialConfig?: Partial<TimerConfig>
): UseGameTimerReturn => {
  const [config, setConfig] = useState<TimerConfig>(() => {
    const saved = localStorage.getItem("gomoku-timer-config");
    const defaultConfig = saved
      ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) }
      : DEFAULT_CONFIG;
    return { ...defaultConfig, ...initialConfig };
  });

  const [timerState, setTimerState] = useState<TimerState>(() => ({
    player1: {
      totalTime: config.totalTime,
      moveTime: 0,
      isActive: true,
    },
    player2: {
      totalTime: config.totalTime,
      moveTime: 0,
      isActive: false,
    },
    isPaused: false,
    gameTime: 0,
  }));

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 保存配置到本地存储
  useEffect(() => {
    localStorage.setItem("gomoku-timer-config", JSON.stringify(config));
  }, [config]);

  // 更新配置
  const updateConfig = useCallback((newConfig: Partial<TimerConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  // 格式化时间显示
  const formatTime = useCallback((seconds: number): string => {
    if (seconds < 0) return "00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      return `${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
  }, []);

  // 检查时间是否用完
  const isTimeUp = useCallback(
    (player: Player): boolean => {
      const playerTimer =
        player === 1 ? timerState.player1 : timerState.player2;

      switch (config.mode) {
        case "unlimited":
          return false;
        case "total_time":
          return playerTimer.totalTime <= 0;
        case "per_move":
          return playerTimer.moveTime >= config.moveTime;
        case "fischer":
          return playerTimer.totalTime <= 0;
        default:
          return false;
      }
    },
    [timerState, config]
  );

  // 计时器主循环
  useEffect(() => {
    if (timerState.isPaused) return;

    intervalRef.current = setInterval(() => {
      setTimerState((prevState) => {
        const newState = { ...prevState };

        // 游戏总时间增加
        newState.gameTime += 1;

        // 活跃玩家计时
        if (newState.player1.isActive) {
          newState.player1.moveTime += 1;
          if (config.mode === "total_time" || config.mode === "fischer") {
            newState.player1.totalTime = Math.max(
              0,
              newState.player1.totalTime - 1
            );
          }
        } else if (newState.player2.isActive) {
          newState.player2.moveTime += 1;
          if (config.mode === "total_time" || config.mode === "fischer") {
            newState.player2.totalTime = Math.max(
              0,
              newState.player2.totalTime - 1
            );
          }
        }

        return newState;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isPaused, config.mode]);

  // 开始计时
  const startTimer = useCallback((currentPlayer: Player) => {
    setTimerState((prev) => ({
      ...prev,
      player1: { ...prev.player1, isActive: currentPlayer === 1 },
      player2: { ...prev.player2, isActive: currentPlayer === 2 },
      isPaused: false,
    }));
  }, []);

  // 暂停计时
  const pauseTimer = useCallback(() => {
    setTimerState((prev) => ({ ...prev, isPaused: true }));
  }, []);

  // 恢复计时
  const resumeTimer = useCallback(() => {
    setTimerState((prev) => ({ ...prev, isPaused: false }));
  }, []);

  // 切换玩家
  const switchPlayer = useCallback(
    (newPlayer: Player) => {
      setTimerState((prev) => {
        const newState = { ...prev };

        // 应用费舍尔增量
        if (config.mode === "fischer") {
          if (prev.player1.isActive) {
            newState.player1.totalTime += config.increment;
          } else if (prev.player2.isActive) {
            newState.player2.totalTime += config.increment;
          }
        }

        // 重置当前步骤时间
        if (prev.player1.isActive) {
          newState.player1.moveTime = 0;
        } else if (prev.player2.isActive) {
          newState.player2.moveTime = 0;
        }

        // 切换活跃玩家
        newState.player1.isActive = newPlayer === 1;
        newState.player2.isActive = newPlayer === 2;

        return newState;
      });
    },
    [config]
  );

  // 重置计时器
  const resetTimer = useCallback(() => {
    setTimerState({
      player1: {
        totalTime: config.totalTime,
        moveTime: 0,
        isActive: true,
      },
      player2: {
        totalTime: config.totalTime,
        moveTime: 0,
        isActive: false,
      },
      isPaused: false,
      gameTime: 0,
    });
  }, [config.totalTime]);

  // 配置更改时重置计时器
  useEffect(() => {
    resetTimer();
  }, [config.mode, config.totalTime, resetTimer]);

  return {
    timerState,
    config,
    updateConfig,
    startTimer,
    pauseTimer,
    resumeTimer,
    switchPlayer,
    resetTimer,
    isTimeUp,
    formatTime,
  };
};
