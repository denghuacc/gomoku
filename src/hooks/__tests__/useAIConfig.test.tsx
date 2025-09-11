import { act } from "@testing-library/react";
import { renderHook } from "../../test/renderHook";
import { useAIConfig } from "../useAIConfig";

describe("useAIConfig", () => {
  beforeEach(() => localStorage.clear());

  it("defaults to disabled AI and can toggle", () => {
    const { result } = renderHook(() => useAIConfig());
    expect(result.current.config.enabled).toBe(false);
    act(() => result.current.toggleAI());
    expect(result.current.config.enabled).toBe(true);
  });

  it("sets difficulty and adjusts maxDepth", () => {
    const { result } = renderHook(() => useAIConfig());
    act(() => result.current.setDifficulty("hard"));
    expect(result.current.config.difficulty).toBe("hard");
    expect(result.current.config.maxDepth).toBeGreaterThanOrEqual(3);
  });

  it("updateConfig updates multiple fields and difficulty", () => {
    const { result } = renderHook(() => useAIConfig());
    act(() => {
      result.current.updateConfig({
        enabled: true,
        difficulty: "easy",
        player: 1,
      });
    });
    expect(result.current.config.enabled).toBe(true);
    expect(result.current.config.difficulty).toBe("easy");
    expect(result.current.config.player).toBe(1);
    expect(result.current.config.maxDepth).toBe(1);
  });

  it("setAIPlayer sets the AI player", () => {
    const { result } = renderHook(() => useAIConfig());
    act(() => {
      result.current.setAIPlayer(1);
    });
    expect(result.current.config.player).toBe(1);
    act(() => {
      result.current.setAIPlayer(2);
    });
    expect(result.current.config.player).toBe(2);
  });

  it("setEvaluationMode sets the evaluation mode", () => {
    const { result } = renderHook(() => useAIConfig());
    act(() => {
      result.current.setEvaluationMode("offensive");
    });
    expect(result.current.config.evaluationMode).toBe("offensive");
    act(() => {
      result.current.setEvaluationMode("defensive");
    });
    expect(result.current.config.evaluationMode).toBe("defensive");
  });

  it("resetConfig resets config and state", () => {
    const { result } = renderHook(() => useAIConfig());
    act(() => {
      result.current.updateConfig({
        enabled: true,
        difficulty: "hard",
        player: 1,
      });
      result.current.setThinking(true);
      result.current.setLastMove({ row: 1, col: 1, player: 1 });
      result.current.setThinkingTime(1234);
      result.current.resetConfig();
    });
    expect(result.current.config.enabled).toBe(false);
    expect(result.current.config.difficulty).toBe("medium");
    expect(result.current.state.isThinking).toBe(false);
    expect(result.current.state.currentMove).toBeNull();
    expect(result.current.state.lastThinkingTime).toBe(0);
  });

  it("setThinking sets isThinking and lastThinkingTime", () => {
    const { result } = renderHook(() => useAIConfig());
    act(() => {
      result.current.setThinking(true);
    });
    expect(result.current.state.isThinking).toBe(true);
    act(() => {
      result.current.setThinking(false);
    });
    expect(result.current.state.isThinking).toBe(false);
    expect(typeof result.current.state.lastThinkingTime).toBe("number");
  });

  it("setLastMove sets currentMove", () => {
    const { result } = renderHook(() => useAIConfig());
    const move = { row: 2, col: 3, player: 2 };
    act(() => {
      result.current.setLastMove(move);
    });
    expect(result.current.state.currentMove).toEqual(move);
  });

  it("setThinkingTime sets lastThinkingTime", () => {
    const { result } = renderHook(() => useAIConfig());
    act(() => {
      result.current.setThinkingTime(888);
    });
    expect(result.current.state.lastThinkingTime).toBe(888);
  });
});
