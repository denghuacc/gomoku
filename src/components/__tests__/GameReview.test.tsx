import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { GameReview } from "../GameReview";
import { Move } from "../../hooks/useGomoku";

describe("GameReview Component", () => {
  const moves: Move[] = [
    { row: 0, col: 1, player: 1 },
    { row: 1, col: 2, player: 2 },
  ];

  test("renders header and toggle review mode", () => {
    const onToggleReviewMode = vi.fn();
    render(
      <GameReview
        moveHistory={[]}
        reviewMode={false}
        onReviewMove={() => {}}
        currentReviewMove={0}
        onToggleReviewMode={onToggleReviewMode}
        isAutoPlaying={false}
        onToggleAutoPlay={() => {}}
      />
    );
    expect(screen.getByText(/对局回顾/i)).toBeInTheDocument();
    const toggleBtn = screen.getByText(/开始回顾/i);
    fireEvent.click(toggleBtn);
    expect(onToggleReviewMode).toHaveBeenCalled();
  });

  test("renders controls and handles slider change in review mode", () => {
    const onReviewMove = vi.fn();
    render(
      <GameReview
        moveHistory={moves}
        reviewMode={true}
        onReviewMove={onReviewMove}
        currentReviewMove={0}
        onToggleReviewMode={() => {}}
        isAutoPlaying={false}
        onToggleAutoPlay={() => {}}
      />
    );
    // Slider should have max equal to moves.length
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    fireEvent.change(slider, { target: { value: String(moves.length) } });
    expect(onReviewMove).toHaveBeenCalledWith(moves.length);
  });

  test("autoplay button appears and toggles correctly", () => {
    const onToggleAutoPlay = vi.fn();
    render(
      <GameReview
        moveHistory={moves}
        reviewMode={true}
        onReviewMove={() => {}}
        currentReviewMove={0}
        onToggleReviewMode={() => {}}
        isAutoPlaying={false}
        onToggleAutoPlay={onToggleAutoPlay}
      />
    );
    // autoplay button appears when in review mode
    const autoBtn = screen.getByText(/自动播放|停止播放/);
    expect(autoBtn).toBeInTheDocument();
    fireEvent.click(autoBtn);
    expect(onToggleAutoPlay).toHaveBeenCalled();
  });

  test("navigation buttons disabled state and calls onReviewMove", () => {
    const onReviewMove = vi.fn();
    render(
      <GameReview
        moveHistory={moves}
        reviewMode={true}
        onReviewMove={onReviewMove}
        currentReviewMove={0}
        onToggleReviewMode={() => {}}
        isAutoPlaying={false}
        onToggleAutoPlay={() => {}}
      />
    );
    const firstBtn = screen.getByTitle("第一步");
    const prevBtn = screen.getByTitle("上一步");
    const nextBtn = screen.getByTitle("下一步");
    const lastBtn = screen.getByTitle("最后一步");
    expect(firstBtn).toBeDisabled();
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();
    expect(lastBtn).not.toBeDisabled();

    fireEvent.click(nextBtn);
    expect(onReviewMove).toHaveBeenCalledWith(1);
    fireEvent.click(lastBtn);
    expect(onReviewMove).toHaveBeenCalledWith(moves.length);
  });

  test("displays current review move and move details", () => {
    const onReviewMove = vi.fn();
    render(
      <GameReview
        moveHistory={moves}
        reviewMode={true}
        onReviewMove={onReviewMove}
        currentReviewMove={1}
        onToggleReviewMode={() => {}}
        isAutoPlaying={false}
        onToggleAutoPlay={() => {}}
      />
    );
    // display move count
    expect(screen.getByText(/第 1 \/ 2 手/)).toBeInTheDocument();
    // details include board coordinate B1 and correct player for move 1
    expect(screen.getByText(/\[B1\] - 黑棋/)).toBeInTheDocument();
  });
});
