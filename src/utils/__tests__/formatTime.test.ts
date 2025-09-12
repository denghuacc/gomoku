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

  it("handles zero correctly", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  it("formats edge cases correctly", () => {
    // Just under an hour
    expect(formatTime(3599)).toBe("59:59");

    // Exactly one minute
    expect(formatTime(60)).toBe("01:00");

    // Large time values
    expect(formatTime(36000)).toBe("10:00:00"); // 10 hours
    expect(formatTime(359999)).toBe("99:59:59"); // 99 hours 59 minutes 59 seconds
  });

  it("handles fractional seconds by truncating", () => {
    expect(formatTime(65.7)).toBe("01:05");
    expect(formatTime(59.9)).toBe("00:59");
  });

  it("formats minutes boundary correctly", () => {
    expect(formatTime(59)).toBe("00:59");
    expect(formatTime(61)).toBe("01:01");
    expect(formatTime(119)).toBe("01:59");
    expect(formatTime(120)).toBe("02:00");
  });
});
