import { describe, it, expect } from "vitest";
import { adjustDifficulty, levelGuide, levelLabel } from "../src/difficulty.js";

describe("adjustDifficulty", () => {
  it("raises difficulty by 1 on a strong answer", () => {
    expect(adjustDifficulty(2, "strong", 0)).toBe(3);
  });

  it("keeps difficulty unchanged on a partial answer", () => {
    expect(adjustDifficulty(3, "partial", 0)).toBe(3);
  });

  it("drops difficulty by 2 on a weak answer", () => {
    expect(adjustDifficulty(3, "weak", 1)).toBe(1);
  });

  it("applies an extra penalty after two consecutive weak answers", () => {
    // consecutiveWeak=2 means this is the second weak answer in a row
    expect(adjustDifficulty(4, "weak", 2)).toBe(1); // -2 base, -1 extra
  });

  it("never drops below difficulty 1", () => {
    expect(adjustDifficulty(1, "weak", 3)).toBe(1);
  });

  it("never climbs above difficulty 5", () => {
    expect(adjustDifficulty(5, "strong", 0)).toBe(5);
  });

  it("does not apply the streak penalty on a single weak answer", () => {
    expect(adjustDifficulty(3, "weak", 1)).toBe(1);
  });
});

describe("levelLabel", () => {
  it("returns the correct label for each level", () => {
    expect(levelLabel(1)).toBe("foundational");
    expect(levelLabel(5)).toBe("expert");
  });

  it("falls back to a default for an invalid level", () => {
    expect(levelLabel(99)).toBe("applied");
  });
});

describe("levelGuide", () => {
  it("returns a non-empty guide string for every valid level", () => {
    for (let i = 1; i <= 5; i++) {
      expect(levelGuide(i).length).toBeGreaterThan(0);
    }
  });
});