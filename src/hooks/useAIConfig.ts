import { useState, useCallback, useEffect, useRef } from "react";
import { Player } from "./useGomoku";
import {
  AIConfig,
  AIState,
  AIDifficulty,
  EvaluationMode,
  AI_DIFFICULTY_OPTIONS,
} from "../ai/types";

// 默认 AI 配置
const DEFAULT_AI_CONFIG: AIConfig = {
  enabled: false,
  difficulty: "medium",
  player: 2, // AI 默认执白
  thinkingTime: 1000,
  evaluationMode: "balanced",
  maxDepth: 3,
};

// AI 配置 Hook 返回类型
interface UseAIConfigReturn {
  config: AIConfig;
  state: AIState;
  updateConfig: (newConfig: Partial<AIConfig>) => void;
  toggleAI: () => void;
  setDifficulty: (difficulty: AIDifficulty) => void;
  setAIPlayer: (player: Player) => void;
  setEvaluationMode: (mode: EvaluationMode) => void;
  resetConfig: () => void;
  setThinking: (thinking: boolean) => void;
  setLastMove: (move: any) => void;
  setThinkingTime: (time: number) => void;
}

export const useAIConfig = (): UseAIConfigReturn => {
  // 从本地存储加载配置
  const [config, setConfig] = useState<AIConfig>(() => {
    const saved = localStorage.getItem("gomoku-ai-config");
    return saved
      ? { ...DEFAULT_AI_CONFIG, ...JSON.parse(saved) }
      : DEFAULT_AI_CONFIG;
  });

  // AI 状态
  const [state, setState] = useState<AIState>({
    isThinking: false,
    currentMove: null,
    evaluatedPositions: [],
    lastThinkingTime: 0,
  });

  const thinkingStartTime = useRef<number>(0);

  // 保存配置到本地存储
  useEffect(() => {
    localStorage.setItem("gomoku-ai-config", JSON.stringify(config));
  }, [config]);

  // 更新配置
  const updateConfig = useCallback((newConfig: Partial<AIConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };

      // 根据难度自动调整相关参数
      if (newConfig.difficulty) {
        const difficultyOption = AI_DIFFICULTY_OPTIONS.find(
          option => option.value === newConfig.difficulty
        );
        if (difficultyOption) {
          updated.maxDepth = difficultyOption.maxDepth;
          updated.thinkingTime = difficultyOption.thinkingTime;
        }
      }

      return updated;
    });
  }, []);

  // 切换 AI 启用状态
  const toggleAI = useCallback(() => {
    updateConfig({ enabled: !config.enabled });
  }, [config.enabled, updateConfig]);

  // 设置难度
  const setDifficulty = useCallback(
    (difficulty: AIDifficulty) => {
      updateConfig({ difficulty });
    },
    [updateConfig]
  );

  // 设置 AI 玩家
  const setAIPlayer = useCallback(
    (player: Player) => {
      updateConfig({ player });
    },
    [updateConfig]
  );

  // 设置评估模式
  const setEvaluationMode = useCallback(
    (mode: EvaluationMode) => {
      updateConfig({ evaluationMode: mode });
    },
    [updateConfig]
  );

  // 重置配置
  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_AI_CONFIG);
    setState({
      isThinking: false,
      currentMove: null,
      evaluatedPositions: [],
      lastThinkingTime: 0,
    });
  }, []);

  // 设置思考状态
  const setThinking = useCallback((thinking: boolean) => {
    if (thinking) {
      thinkingStartTime.current = Date.now();
    } else {
      const thinkingTime = Date.now() - thinkingStartTime.current;
      setState(prev => ({
        ...prev,
        isThinking: thinking,
        lastThinkingTime: thinkingTime,
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isThinking: thinking,
    }));
  }, []);

  // 设置最后的移动
  const setLastMove = useCallback((move: any) => {
    setState(prev => ({
      ...prev,
      currentMove: move,
    }));
  }, []);

  // 设置思考时间
  const setThinkingTime = useCallback((time: number) => {
    setState(prev => ({
      ...prev,
      lastThinkingTime: time,
    }));
  }, []);

  return {
    config,
    state,
    updateConfig,
    toggleAI,
    setDifficulty,
    setAIPlayer,
    setEvaluationMode,
    resetConfig,
    setThinking,
    setLastMove,
    setThinkingTime,
  };
};
