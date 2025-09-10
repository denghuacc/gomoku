import { Player, Move } from "../hooks/useGomoku";

// AI 难度级别
export type AIDifficulty = "easy" | "medium" | "hard";

// AI 玩家类型
export interface AIPlayer {
  difficulty: AIDifficulty;
  player: Player; // 1 或 2
  thinkingTime: number; // 思考时间（毫秒）
}

// 位置评分接口
export interface PositionScore {
  row: number;
  col: number;
  score: number;
}

// 评估模式
export type EvaluationMode = "offensive" | "defensive" | "balanced";

// AI 配置接口
export interface AIConfig {
  enabled: boolean;
  difficulty: AIDifficulty;
  player: Player;
  thinkingTime: number;
  evaluationMode: EvaluationMode;
  maxDepth: number; // Minimax 最大搜索深度
}

// AI 状态接口
export interface AIState {
  isThinking: boolean;
  currentMove: Move | null;
  evaluatedPositions: PositionScore[];
  lastThinkingTime: number;
}

// 评估函数返回类型
export interface EvaluationResult {
  score: number;
  bestMove: Move | null;
  depth: number;
  evaluatedNodes: number;
}

// 模式描述
export const AI_DIFFICULTY_OPTIONS: {
  value: AIDifficulty;
  label: string;
  description: string;
  maxDepth: number;
  thinkingTime: number;
}[] = [
  {
    value: "easy",
    label: "简单",
    description: "随机落子为主，偶有策略",
    maxDepth: 1,
    thinkingTime: 500,
  },
  {
    value: "medium",
    label: "中等",
    description: "基础策略，攻守兼备",
    maxDepth: 3,
    thinkingTime: 1000,
  },
  {
    value: "hard",
    label: "困难",
    description: "深度搜索，精确计算",
    maxDepth: 4,
    thinkingTime: 1500,
  },
];

export const EVALUATION_MODE_OPTIONS: {
  value: EvaluationMode;
  label: string;
  description: string;
}[] = [
  {
    value: "offensive",
    label: "进攻型",
    description: "优先进攻，积极连线",
  },
  {
    value: "defensive",
    label: "防守型",
    description: "优先防守，阻止对手",
  },
  {
    value: "balanced",
    label: "平衡型",
    description: "攻守平衡，综合考虑",
  },
];
