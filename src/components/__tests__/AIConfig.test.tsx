import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AIConfig from "../AIConfig";
import { AIConfig as AIConfigType, AIState } from "../../ai/types";
import { Player } from "../../hooks/useGomoku";
import { vi } from "vitest";

describe("AIConfig Component", () => {
  const mockConfig: AIConfigType = {
    enabled: true,
    difficulty: "medium",
    player: 1,
    thinkingTime: 1000,
    evaluationMode: "balanced",
    maxDepth: 3,
  };

  const mockState: AIState = {
    isThinking: false,
    currentMove: null,
    evaluatedPositions: [],
    lastThinkingTime: 0,
  };

  const mockProps = {
    config: mockConfig,
    state: mockState,
    currentPlayer: 1 as Player,
    gameActive: true,
    updateConfig: vi.fn(),
    toggleAI: vi.fn(),
    setDifficulty: vi.fn(),
    setAIPlayer: vi.fn(),
    setEvaluationMode: vi.fn(),
    resetConfig: vi.fn(),
  };

  test("renders AIConfig component", () => {
    render(<AIConfig {...mockProps} />);
    const element = screen.getByText(/AI 对手/i);
    expect(element).toBeInTheDocument();
  });

  test("expand and interact with AIConfig controls", () => {
    render(<AIConfig {...mockProps} />);
    // Expand panel
    fireEvent.click(screen.getByText(/AI 对手/i));
    // Check enable switch label
    expect(screen.getByText(/启用 AI 对手/i)).toBeInTheDocument();
    // Toggle AI
    const toggleBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(toggleBtn);
    expect(mockProps.toggleAI).toHaveBeenCalled();
    // Set AI player to white
    const whiteBtn = screen.getByText(/白棋$/i);
    fireEvent.click(whiteBtn);
    expect(mockProps.setAIPlayer).toHaveBeenCalledWith(2);
    // Change difficulty to easy
    const easyOption = screen.getByLabelText(/简单/i);
    fireEvent.click(easyOption);
    expect(mockProps.setDifficulty).toHaveBeenCalledWith("easy");
    // Change evaluation mode to defensive
    const defOption = screen.getByLabelText(/防守型/i);
    fireEvent.click(defOption);
    expect(mockProps.setEvaluationMode).toHaveBeenCalledWith("defensive");
    // Reset config
    const resetBtn = screen.getByRole("button", { name: /重置 AI 配置/i });
    fireEvent.click(resetBtn);
    expect(mockProps.resetConfig).toHaveBeenCalled();
  });

  test("shows thinking spinner when AI is thinking", () => {
    const thinkingState = { ...mockState, isThinking: true };
    render(<AIConfig {...mockProps} state={thinkingState} />);
    fireEvent.click(screen.getByText(/AI 对手/i));
    expect(screen.getByText(/思考中.../i)).toBeInTheDocument();
  });
});
