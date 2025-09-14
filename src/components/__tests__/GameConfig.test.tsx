import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import GameConfig from "../GameConfig";
import {
  GameConfig as GameConfigType,
  PlayerType,
  BOARD_SIZE_OPTIONS,
  WIN_CONDITION_OPTIONS,
  FIRST_PLAYER_OPTIONS,
} from "../../hooks/useGameConfig";

describe("GameConfig Component", () => {
  const mockConfig: GameConfigType = {
    boardSize: 15,
    winCondition: 5,
    firstPlayer: 1 as PlayerType,
    allowUndo: true,
  };

  const mockProps = {
    config: mockConfig,
    setBoardSize: vi.fn(),
    setWinCondition: vi.fn(),
    setFirstPlayer: vi.fn(),
    setAllowUndo: vi.fn(),
    resetConfig: vi.fn(),
    onApplyConfig: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders GameConfig header", () => {
    render(<GameConfig {...mockProps} />);
    expect(screen.getByText(/游戏设置/i)).toBeInTheDocument();
  });

  test("expands and shows options when clicked", () => {
    render(<GameConfig {...mockProps} />);
    fireEvent.click(screen.getByText(/游戏设置/i));
    expect(screen.getByText(/棋盘规格/i)).toBeInTheDocument();
  });

  test("calls setBoardSize when selecting board size option", () => {
    render(<GameConfig {...mockProps} />);
    fireEvent.click(screen.getByText(/游戏设置/i));
    // select one board size option
    fireEvent.click(screen.getByText(BOARD_SIZE_OPTIONS[0].label));
    expect(mockProps.setBoardSize).toHaveBeenCalledWith(
      BOARD_SIZE_OPTIONS[0].value
    );
  });

  test("calls setWinCondition when selecting win condition option", () => {
    render(<GameConfig {...mockProps} />);
    fireEvent.click(screen.getByText(/游戏设置/i));
    // select one win condition option
    fireEvent.click(screen.getByText(WIN_CONDITION_OPTIONS[0].label));
    expect(mockProps.setWinCondition).toHaveBeenCalledWith(
      WIN_CONDITION_OPTIONS[0].value
    );
  });

  test("calls setFirstPlayer when selecting first player option", () => {
    render(<GameConfig {...mockProps} />);
    fireEvent.click(screen.getByText(/游戏设置/i));
    // select one first player option
    fireEvent.click(screen.getByText(FIRST_PLAYER_OPTIONS[1].label));
    expect(mockProps.setFirstPlayer).toHaveBeenCalledWith(
      FIRST_PLAYER_OPTIONS[1].value
    );
  });

  test("toggles allowUndo option", () => {
    render(<GameConfig {...mockProps} />);
    fireEvent.click(screen.getByText(/游戏设置/i));
    const allowUndoLabel = screen.getByText(/允许悔棋/i);
    const toggleButton = allowUndoLabel
      .closest("label")
      ?.querySelector("button");
    if (!toggleButton) throw new Error("Toggle button not found");
    fireEvent.click(toggleButton);
    expect(mockProps.setAllowUndo).toHaveBeenCalledWith(!mockConfig.allowUndo);
  });

  test("calls onApplyConfig and collapses on apply", () => {
    render(<GameConfig {...mockProps} />);
    fireEvent.click(screen.getByText(/游戏设置/i));
    fireEvent.click(screen.getByText(/应用设置/i));
    expect(mockProps.onApplyConfig).toHaveBeenCalled();
    expect(screen.queryByText(/棋盘规格/i)).not.toBeInTheDocument();
  });

  test("calls resetConfig on reset", () => {
    render(<GameConfig {...mockProps} />);
    fireEvent.click(screen.getByText(/游戏设置/i));
    fireEvent.click(screen.getByText(/重置/i));
    expect(mockProps.resetConfig).toHaveBeenCalled();
  });
});
