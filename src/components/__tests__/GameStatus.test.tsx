import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameStatus from "../GameStatus";
import { Player } from "../../hooks/useGomoku";

describe("GameStatus Component", () => {
  test("shows ongoing game status", () => {
    render(
      <GameStatus gameActive={true} currentPlayer={1 as Player} winner={null} />
    );
    expect(screen.getByText(/游戏进行中 - 黑棋回合/i)).toBeInTheDocument();
  });

  test("shows draw status when game inactive and no winner", () => {
    render(
      <GameStatus
        gameActive={false}
        currentPlayer={2 as Player}
        winner={null}
      />
    );
    expect(screen.getByText(/游戏结束 - 平局!/i)).toBeInTheDocument();
  });

  test("shows winner status when winner exists", () => {
    render(
      <GameStatus
        gameActive={false}
        currentPlayer={2 as Player}
        winner={2 as Player}
      />
    );
    expect(screen.getByText(/游戏结束 - 白棋获胜!/i)).toBeInTheDocument();
  });
});
