import { describe, it, expect } from "vitest";
import { AI_DIFFICULTY_OPTIONS, EVALUATION_MODE_OPTIONS } from "../types";

describe("ai types constants", () => {
  it("has difficulty options including medium", () => {
    expect(AI_DIFFICULTY_OPTIONS.some(o => o.value === "medium")).toBe(true);
  });

  it("has evaluation mode options", () => {
    expect(EVALUATION_MODE_OPTIONS.length).toBeGreaterThan(0);
  });
});
