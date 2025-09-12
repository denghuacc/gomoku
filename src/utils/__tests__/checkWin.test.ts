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

  it("returns false when sequence is blocked by opponent", () => {
    const b = emptyBoard();
    // Place player 1 stones: 1 1 1 1
    for (let c = 2; c <= 5; c++) b[4][c] = p1;
    // Block with player 2 stone at position before the sequence
    b[4][1] = p2;
    // Block with player 2 stone at position after the sequence
    b[4][6] = p2;

    // Should not detect win as sequence is blocked on both sides
    expect(checkWin(b as any, 4, 3, 1 as any, 5, size)).toBe(false);
  });

  it("handles edge cases near board boundaries", () => {
    const b = emptyBoard();
    // Place stones at edge of board
    for (let c = 0; c < 4; c++) b[0][c] = p1;
    b[0][4] = p2; // Block the continuation

    expect(checkWin(b as any, 0, 1, 1 as any, 5, size)).toBe(false);

    // Test vertical at edge
    for (let r = 0; r < 4; r++) b[r][0] = p2;
    b[4][0] = p1; // Block the continuation

    expect(checkWin(b as any, 1, 0, 2 as any, 5, size)).toBe(false);
  });

  it("detects win with different win conditions", () => {
    const b = emptyBoard();
    // Test with win condition of 3
    for (let c = 2; c <= 4; c++) b[3][c] = p1;
    expect(checkWin(b as any, 3, 3, 1 as any, 3, size)).toBe(true);

    // Test with win condition of 4
    for (let c = 5; c <= 8; c++) b[5][c] = p2;
    expect(checkWin(b as any, 5, 6, 2 as any, 4, size)).toBe(true);
  });

  it("handles single stone placement correctly", () => {
    const b = emptyBoard();
    b[4][4] = p1;

    // Single stone should not win with win condition > 1
    expect(checkWin(b as any, 4, 4, 1 as any, 5, size)).toBe(false);
    expect(checkWin(b as any, 4, 4, 1 as any, 2, size)).toBe(false);

    // Single stone should win with win condition of 1
    expect(checkWin(b as any, 4, 4, 1 as any, 1, size)).toBe(true);
  });
});
