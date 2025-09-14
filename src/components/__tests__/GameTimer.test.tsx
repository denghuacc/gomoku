import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import GameTimer from "../GameTimer";
import { Player } from "../../hooks/useGomoku";
import { TimerState, TimerConfig, TimerMode } from "../../hooks/useGameTimer";

describe("GameTimer advanced coverage", () => {
  const baseTimerState = {
    player1: { totalTime: 60, moveTime: 10, isActive: true },
    player2: { totalTime: 20, moveTime: 2, isActive: false },
    isPaused: false,
    gameTime: 30,
  };
  const baseConfig = {
    mode: "total_time" as TimerMode,
    totalTime: 60,
    moveTime: 10,
    increment: 5,
  };
  const baseProps = {
    timerState: baseTimerState,
    config: baseConfig,
    currentPlayer: 1 as Player,
    gameActive: true,
    updateConfig: vi.fn(),
    pauseTimer: vi.fn(),
    resumeTimer: vi.fn(),
    resetTimer: vi.fn(),
    formatTime: (s: number) => `#${s}`,
    isTimeUp: (p: Player) => p === 2,
  };

  test("renders total_time mode and progress bar", () => {
    // player1.totalTime < 12 to trigger orange warning
    const props = {
      ...baseProps,
      timerState: {
        ...baseProps.timerState,
        player1: { ...baseProps.timerState.player1, totalTime: 5 },
      },
    };
    render(<GameTimer {...props} />);
    // 进度条应存在
    expect(document.querySelectorAll(".bg-primary").length).toBeGreaterThan(0);
    // 白棋超时应为红色
    expect(document.querySelectorAll(".text-red-500").length).toBeGreaterThan(
      0
    );
    // 黑棋剩余时间应为橙色警告
    expect(
      document.querySelectorAll(".text-orange-500").length
    ).toBeGreaterThan(0);
  });

  test("renders per_move mode and total time", () => {
    const props = {
      ...baseProps,
      config: { ...baseConfig, mode: "per_move" as TimerMode },
    };
    render(<GameTimer {...props} />);
    // 总用时文本
    expect(
      document.querySelectorAll(".text-xs.text-gray-500").length
    ).toBeGreaterThan(0);
  });

  test("renders fischer mode and increment input", () => {
    const props = {
      ...baseProps,
      config: { ...baseConfig, mode: "fischer" as TimerMode },
    };
    render(<GameTimer {...props} />);
    fireEvent.click(screen.getByText(/计时设置/i));
    // increment 输入框
    expect(screen.getByLabelText(/增量时间/)).toBeInTheDocument();
  });

  test("changes totalTime input", () => {
    render(<GameTimer {...baseProps} />);
    fireEvent.click(screen.getByText(/计时设置/i));
    // Use id to avoid ambiguous label
    const input = screen.getByLabelText("总时间 (分钟)", {
      selector: "#totalTimeInput",
    });
    fireEvent.change(input, { target: { value: "2" } });
    expect(baseProps.updateConfig).toHaveBeenCalledWith({ totalTime: 120 });
  });

  test("changes moveTime input in per_move", () => {
    const props = {
      ...baseProps,
      config: { ...baseConfig, mode: "per_move" as TimerMode },
    };
    render(<GameTimer {...props} />);
    fireEvent.click(screen.getByText(/计时设置/i));
    const input = screen.getByLabelText(/每步时间/);
    fireEvent.change(input, { target: { value: "20" } });
    expect(props.updateConfig).toHaveBeenCalledWith({ moveTime: 20 });
  });

  test("changes increment input in fischer", () => {
    const props = {
      ...baseProps,
      config: { ...baseConfig, mode: "fischer" as TimerMode },
    };
    render(<GameTimer {...props} />);
    fireEvent.click(screen.getByText(/计时设置/i));
    const input = screen.getByLabelText(/增量时间/);
    fireEvent.change(input, { target: { value: "7" } });
    expect(props.updateConfig).toHaveBeenCalledWith({ increment: 7 });
  });

  test("progress bar color is orange when <20%", () => {
    const props = {
      ...baseProps,
      timerState: {
        ...baseTimerState,
        player1: { ...baseTimerState.player1, totalTime: 5 },
      },
    };
    render(<GameTimer {...props} />);
    expect(document.querySelectorAll(".bg-orange-500").length).toBeGreaterThan(
      0
    );
  });

  test("progress bar color is red when isTimeUp", () => {
    const props = {
      ...baseProps,
      isTimeUp: () => true,
    };
    render(<GameTimer {...props} />);
    expect(document.querySelectorAll(".bg-red-500").length).toBeGreaterThan(0);
  });
});

describe("GameTimer Component", () => {
  const mockTimerState: TimerState = {
    player1: { totalTime: 100, moveTime: 10, isActive: true },
    player2: { totalTime: 100, moveTime: 5, isActive: false },
    isPaused: false,
    gameTime: 12,
  };
  const mockConfig: TimerConfig = {
    mode: "unlimited",
    totalTime: 100,
    moveTime: 10,
    increment: 5,
  };
  const mockProps = {
    timerState: mockTimerState,
    config: mockConfig,
    currentPlayer: 1 as Player,
    gameActive: true,
    updateConfig: vi.fn(),
    pauseTimer: vi.fn(),
    resumeTimer: vi.fn(),
    resetTimer: vi.fn(),
    formatTime: (s: number) => `#${s}`,
    isTimeUp: () => false,
  };

  test("renders GameTimer header and times", () => {
    render(<GameTimer {...mockProps} />);
    expect(screen.getByText(/游戏计时/i)).toBeInTheDocument();
    // Check formatted time for gameTime since unlimited
    expect(screen.getAllByText("#12")[0]).toBeInTheDocument();
  });

  test("pause button calls pauseTimer", () => {
    render(<GameTimer {...mockProps} />);
    const btn = screen.getByRole("button", { name: /暂停/i });
    fireEvent.click(btn);
    expect(mockProps.pauseTimer).toHaveBeenCalled();
  });

  test("reset button calls resetTimer", () => {
    render(<GameTimer {...mockProps} />);
    const resetBtn = screen.getByRole("button", { name: /重置/i });
    fireEvent.click(resetBtn);
    expect(mockProps.resetTimer).toHaveBeenCalled();
  });

  test("expand and collapse config section", () => {
    render(<GameTimer {...mockProps} />);
    const configToggle = screen.getByText(/计时设置/i);
    fireEvent.click(configToggle);
    // After expanding, should show timer mode options
    expect(screen.getByText(/计时模式/i)).toBeInTheDocument();
    // Collapse
    fireEvent.click(configToggle);
    expect(screen.queryByText(/计时模式/i)).toBeNull();
  });

  test("resume button calls resumeTimer when paused", () => {
    const pausedProps = {
      ...mockProps,
      timerState: { ...mockTimerState, isPaused: true },
    };
    render(<GameTimer {...pausedProps} />);
    const btn = screen.getByRole("button", { name: /继续/i });
    fireEvent.click(btn);
    expect(mockProps.resumeTimer).toHaveBeenCalled();
  });

  test("pause button is disabled when gameActive is false", () => {
    render(<GameTimer {...mockProps} gameActive={false} />);
    const btn = screen.getByRole("button", { name: /暂停/i });
    expect(btn).toBeDisabled();
  });

  test("changes timer mode via config options", () => {
    render(<GameTimer {...mockProps} />);
    fireEvent.click(screen.getByText(/计时设置/i));
    const option = screen.getByText(/步时制/);
    fireEvent.click(option);
    expect(mockProps.updateConfig).toHaveBeenCalledWith({ mode: "per_move" });
  });
});
