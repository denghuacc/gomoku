import { describe, it, expect } from "vitest";
import { checkWin } from "../checkWin";
type Cell = number;

describe("checkWin util", () => {
  const size = 9;
  const empty = 0 as Cell;
  const p1 = 1 as Cell;
  const p2 = 2 as Cell;

  function emptyBoard(): Cell[][] {
    return Array(size)
      .fill(null)
      .map(() => Array(size).fill(empty));
  }

  it("detects horizontal win", () => {
    const b = emptyBoard();
    const row = 4;
    for (let c = 2; c <= 6; c++) b[row][c] = p1;
    expect(checkWin(b as any, row, 4, 1 as any, 5, size)).toBe(true);
  });

  it("detects vertical win", () => {
    const b = emptyBoard();
    const col = 3;
    for (let r = 1; r <= 5; r++) b[r][col] = p2;
    expect(checkWin(b as any, 3, col, 2 as any, 5, size)).toBe(true);
  });

  it("detects diagonal wins", () => {
    const b = emptyBoard();
    for (let i = 0; i < 5; i++) b[2 + i][2 + i] = p1;
    expect(checkWin(b as any, 4, 4, 1 as any, 5, size)).toBe(true);

    const b2 = emptyBoard();
    for (let i = 0; i < 5; i++) b2[6 - i][2 + i] = p2;
    expect(checkWin(b2 as any, 4, 4, 2 as any, 5, size)).toBe(true);
  });

  it("returns false when not enough in a row", () => {
    const b = emptyBoard();
    for (let c = 0; c < 4; c++) b[0][c] = p1;
    expect(checkWin(b as any, 0, 1, 1 as any, 5, size)).toBe(false);
  });
});
