import { describe, it, expect } from "vitest";
import {
  BOARD_SIZE_OPTIONS,
  WIN_CONDITION_OPTIONS,
  FIRST_PLAYER_OPTIONS,
} from "../useGameConfig";

describe("game config constants", () => {
  it("exports board size options", () => {
    expect(Array.isArray(BOARD_SIZE_OPTIONS)).toBe(true);
    expect(BOARD_SIZE_OPTIONS.some((o) => o.value === 15)).toBe(true);
  });

  it("exports win condition options including 5", () => {
    expect(WIN_CONDITION_OPTIONS.some((o) => o.value === 5)).toBe(true);
  });

  it("exports first player options including 1 and 2", () => {
    expect(FIRST_PLAYER_OPTIONS.some((o) => o.value === 1)).toBe(true);
    expect(FIRST_PLAYER_OPTIONS.some((o) => o.value === 2)).toBe(true);
  });
});
