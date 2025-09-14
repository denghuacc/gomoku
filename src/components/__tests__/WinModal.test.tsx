import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import WinModal from "../WinModal";
import { Player } from "../../hooks/useGomoku";

describe("WinModal Component", () => {
  const onNewGame = vi.fn();
  const onClose = vi.fn();

  test("does not render when closed", () => {
    render(
      <WinModal
        winner={1 as Player}
        isOpen={false}
        onNewGame={onNewGame}
        onClose={onClose}
      />
    );
    expect(screen.queryByText(/获胜/i)).toBeNull();
  });

  test("renders correctly and triggers callbacks", () => {
    render(
      <WinModal
        winner={2 as Player}
        isOpen={true}
        onNewGame={onNewGame}
        onClose={onClose}
      />
    );
    // Winner text
    expect(screen.getByText(/白棋获胜!/i)).toBeInTheDocument();
    // Start new game
    const newGameBtn = screen.getByRole("button", { name: /开始新游戏/i });
    fireEvent.click(newGameBtn);
    expect(onNewGame).toHaveBeenCalled();
    // View board button calls onClose
    const viewBoardBtn = screen.getByRole("button", { name: /查看棋盘/i });
    fireEvent.click(viewBoardBtn);
    expect(onClose).toHaveBeenCalled();
    // Close icon button
    const closeBtn = screen.getByTitle(/关闭/i);
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test("renders congratulatory message", () => {
    render(
      <WinModal
        winner={1 as Player}
        isOpen={true}
        onNewGame={onNewGame}
        onClose={onClose}
      />
    );
    expect(
      screen.getByText(/恭喜您赢得了这场精彩的比赛!/i)
    ).toBeInTheDocument();
  });

  test("clicking backdrop triggers onClose", () => {
    const backdropClose = vi.fn();
    const { container } = render(
      <WinModal
        winner={2 as Player}
        isOpen={true}
        onNewGame={() => {}}
        onClose={backdropClose}
      />
    );
    // click on backdrop (outermost div)
    fireEvent.click(container.firstChild as Element);
    expect(backdropClose).toHaveBeenCalled();
  });
});
