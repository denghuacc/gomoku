import { act } from "@testing-library/react";
import { renderHook } from "../../test/renderHook";
import { useGameTimer } from "../useGameTimer";
import { vi } from "vitest";

describe("useGameTimer", () => {
  let wrapper: any = null;
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    wrapper = null;
  });
  afterEach(() => {
    vi.useRealTimers();
    if (wrapper && typeof wrapper.unmount === "function") wrapper.unmount();
  });

  it("formats time correctly", () => {
    wrapper = renderHook(() => useGameTimer());
    const { result } = wrapper;
    expect(result.current.formatTime(65)).toBe("01:05");
    expect(result.current.formatTime(3661)).toBe("01:01:01");
    expect(result.current.formatTime(-5)).toBe("00:00");
  });

  it("updates timer configuration", () => {
    wrapper = renderHook(() => useGameTimer());
    const { result } = wrapper;
    act(() => {
      result.current.updateConfig({ mode: "fischer", increment: 15 });
    });
    expect(result.current.config.mode).toBe("fischer");
    expect(result.current.config.increment).toBe(15);
  });

  it("starts the timer for the current player", () => {
    wrapper = renderHook(() => useGameTimer());
    const { result } = wrapper;
    act(() => {
      result.current.startTimer(2);
    });
    expect(result.current.timerState.player1.isActive).toBe(false);
    expect(result.current.timerState.player2.isActive).toBe(true);
  });

  it("pauses and resumes the timer", () => {
    wrapper = renderHook(() => useGameTimer());
    const { result } = wrapper;
    act(() => {
      result.current.pauseTimer();
    });
    expect(result.current.timerState.isPaused).toBe(true);
    act(() => {
      result.current.resumeTimer();
    });
    expect(result.current.timerState.isPaused).toBe(false);
  });

  it("switches the active player", () => {
    wrapper = renderHook(() => useGameTimer());
    const { result } = wrapper;
    act(() => {
      result.current.switchPlayer(2);
    });
    expect(result.current.timerState.player1.isActive).toBe(false);
    expect(result.current.timerState.player2.isActive).toBe(true);
  });

  it("resets the timer to default state", () => {
    wrapper = renderHook(() => useGameTimer());
    const { result } = wrapper;
    act(() => {
      result.current.updateConfig({ totalTime: 600 });
      result.current.resetTimer();
    });
    expect(result.current.timerState.player1.totalTime).toBe(600);
    expect(result.current.timerState.player2.totalTime).toBe(600);
    expect(result.current.timerState.isPaused).toBe(false);
  });

  it("checks if time is up for a player", () => {
    wrapper = renderHook(() =>
      useGameTimer({ mode: "total_time", totalTime: 0 })
    );
    const { result } = wrapper;
    expect(result.current.isTimeUp(1)).toBe(true);
    expect(result.current.isTimeUp(2)).toBe(true);
  });

  it("checks if time is up for per_move mode", () => {
    wrapper = renderHook(() =>
      useGameTimer({ mode: "per_move", moveTime: 10 })
    );
    const { result } = wrapper;
    act(() => {
      result.current.timerState.player1.moveTime = 10;
    });
    expect(result.current.isTimeUp(1)).toBe(true);
    expect(result.current.isTimeUp(2)).toBe(false);
  });

  it("applies Fischer increment when switching players", () => {
    wrapper = renderHook(() =>
      useGameTimer({ mode: "fischer", increment: 5, totalTime: 20 })
    );
    const { result } = wrapper;
    act(() => {
      result.current.switchPlayer(2);
    });
    expect(result.current.timerState.player1.totalTime).toBe(25);
    expect(result.current.timerState.player2.isActive).toBe(true);
  });

  it("updates timer state in the main loop", () => {
    wrapper = renderHook(() =>
      useGameTimer({ mode: "total_time", totalTime: 5 })
    );
    const { result } = wrapper;
    act(() => {
      result.current.startTimer(1);
    });
    act(() => {
      vi.advanceTimersByTime(3000); // Advance 3 seconds
    });
    expect(result.current.timerState.player1.totalTime).toBe(2);
    expect(result.current.timerState.player1.moveTime).toBe(3);
  });
});
