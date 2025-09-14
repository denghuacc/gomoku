import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import GameTabs from "../GameTabs";
import { Player, Move } from "../../hooks/useGomoku";
import { TimerState, TimerConfig } from "../../hooks/useGameTimer";
import { GameConfig as GameConfigType } from "../../hooks/useGameConfig";
import { AIConfig, AIState } from "../../ai/types";

describe("GameTabs Component", () => {
  const mockProps = {
    // GameInfo
    currentPlayer: 1 as Player,
    gameTime: 0,
    moveCount: 0,
    audioEnabled: false,
    volume: 0,
    toggleAudio: vi.fn(),
    setVolume: vi.fn(),
    // GameTimer
    timerState: {
      player1: { totalTime: 60, moveTime: 0, isActive: true },
      player2: { totalTime: 60, moveTime: 0, isActive: false },
      isPaused: false,
      gameTime: 0,
    } as TimerState,
    timerConfig: {
      mode: "unlimited",
      totalTime: 60,
      moveTime: 30,
      increment: 5,
    } as TimerConfig,
    gameActive: true,
    updateTimerConfig: vi.fn(),
    pauseTimer: vi.fn(),
    resumeTimer: vi.fn(),
    resetTimer: vi.fn(),
    formatTime: (s: number) => `${s}`,
    isTimeUp: () => false,
    // GameConfig
    config: {
      boardSize: 15,
      winCondition: 5,
      firstPlayer: 1,
      allowUndo: true,
    } as GameConfigType,
    setBoardSize: vi.fn(),
    setWinCondition: vi.fn(),
    setFirstPlayer: vi.fn(),
    setAllowUndo: vi.fn(),
    resetConfig: vi.fn(),
    onApplyConfig: vi.fn(),
    // GameReview
    moveHistory: [] as Move[],
    reviewMode: false,
    currentReviewMove: 0,
    autoPlayInterval: null,
    onReviewMove: vi.fn(),
    onToggleReviewMode: vi.fn(),
    onToggleAutoPlay: vi.fn(),
    // AIConfig
    aiConfig: {
      enabled: false,
      difficulty: "easy",
      player: 1,
      thinkingTime: 100,
      evaluationMode: "offensive",
      maxDepth: 1,
    } as AIConfig,
    aiState: {
      isThinking: false,
      currentMove: null,
      evaluatedPositions: [],
      lastThinkingTime: 0,
    } as AIState,
    updateAIConfig: vi.fn(),
    toggleAI: vi.fn(),
    setAIDifficulty: vi.fn(),
    setAIPlayer: vi.fn(),
    setAIEvaluationMode: vi.fn(),
    resetAIConfig: vi.fn(),
  };

  test("renders tabs and switches content", () => {
    render(<GameTabs {...mockProps} />);
    // Check default tab content (GameInfo)
    expect(screen.getByText(/当前回合/i)).toBeInTheDocument();

    // Click Timer tab
    fireEvent.click(screen.getByText(/计时器/i));
    expect(screen.getByText(/游戏计时/i)).toBeInTheDocument();

    // Click Settings tab
    fireEvent.click(screen.getByText(/游戏设置/i));
    expect(
      screen.getByRole("heading", { name: /游戏设置/i })
    ).toBeInTheDocument();
  });
});
