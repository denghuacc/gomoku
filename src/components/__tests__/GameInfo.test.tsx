import { render, screen, fireEvent, within } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import GameInfo from "../GameInfo";
import { Player } from "../../hooks/useGomoku";

describe("GameInfo Component", () => {
  const mockProps = {
    currentPlayer: 1 as Player,
    gameTime: 61, // 61 seconds => 01:01
    moveCount: 5,
    audioEnabled: true,
    volume: 0.5,
    toggleAudio: vi.fn(),
    setVolume: vi.fn(),
  };

  test("renders GameInfo header and formatted time", () => {
    render(<GameInfo {...mockProps} />);
    expect(screen.getByText(/游戏信息/i)).toBeInTheDocument();
    expect(screen.getByText("01:01")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("toggle audio button calls callback", () => {
    render(<GameInfo {...mockProps} />);
    const buttons = screen.getAllByRole("button");
    const toggleBtn = buttons[0];
    fireEvent.click(toggleBtn);
    expect(mockProps.toggleAudio).toHaveBeenCalled();
  });

  test("renders volume controls when audioEnabled is true", () => {
    render(<GameInfo {...mockProps} />);
    // Slider should be visible
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    // Volume percentage display
    expect(
      screen.getByText(`${Math.round(mockProps.volume * 100)}%`)
    ).toBeInTheDocument();
  });

  test("calls setVolume on volume change", () => {
    render(<GameInfo {...mockProps} />);
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "0.8" } });
    expect(mockProps.setVolume).toHaveBeenCalledWith(0.8);
  });

  test("does not render volume controls when audioEnabled is false", () => {
    render(<GameInfo {...mockProps} audioEnabled={false} />);
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  test("displays white player correctly", () => {
    render(<GameInfo {...mockProps} currentPlayer={2 as Player} />);
    // scope to current turn row
    const row = screen.getByText("当前回合").parentElement!;
    const whiteText = within(row).getByText("白棋");
    expect(whiteText).toBeInTheDocument();
    // the circle indicator is the element before the text
    const circle = whiteText.previousElementSibling as HTMLElement;
    expect(circle).toHaveClass("bg-white");
  });

  test("renders game rules list items", () => {
    render(<GameInfo {...mockProps} />);
    expect(screen.getByText(/黑棋和白棋轮流在棋盘上落子/i)).toBeInTheDocument();
    expect(
      screen.getByText(/先在横、竖或斜方向形成五子连线者获胜/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/点击棋盘上的交叉点放置棋子/i)).toBeInTheDocument();
  });
});
