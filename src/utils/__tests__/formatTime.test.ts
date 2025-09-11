import { describe, it, expect } from "vitest";
import { formatTime } from "../formatTime";

describe("formatTime util", () => {
  it("formats seconds < 60 as MM:SS", () => {
    expect(formatTime(5)).toBe("00:05");
    expect(formatTime(65)).toBe("01:05");
  });

  it("formats hours when needed", () => {
    expect(formatTime(3600)).toBe("01:00:00");
    expect(formatTime(3661)).toBe("01:01:01");
  });

  it("returns 00:00 for negative input", () => {
    expect(formatTime(-5)).toBe("00:00");
  });
});
