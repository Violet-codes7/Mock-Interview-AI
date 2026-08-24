import { describe, it, expect } from "vitest";
import { QUESTION_BANK, pickQuestion } from "../src/questionBank.js";

describe("QUESTION_BANK", () => {
  it("has no duplicate ids", () => {
    const ids = QUESTION_BANK.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every question has a valid phase", () => {
    const validPhases = ["fundamentals", "design"];
    QUESTION_BANK.forEach((q) => expect(validPhases).toContain(q.phase));
  });

  it("every question has a difficulty between 1 and 5", () => {
    QUESTION_BANK.forEach((q) => {
      expect(q.difficulty).toBeGreaterThanOrEqual(1);
      expect(q.difficulty).toBeLessThanOrEqual(5);
    });
  });
});

describe("pickQuestion", () => {
  it("returns a question matching the requested phase", () => {
    const q = pickQuestion("fundamentals", 3, []);
    expect(q.phase).toBe("fundamentals");
  });

  it("never returns a question whose id is in askedIds", () => {
    const asked = QUESTION_BANK.filter((q) => q.phase === "design").map((q) => q.id);
    const result = pickQuestion("design", 3, asked);
    expect(result).toBeNull();
  });

  it("prefers a question close to the requested difficulty", () => {
    const q = pickQuestion("fundamentals", 5, []);
    // shouldn't hand back a difficulty-1 question when 5 is requested,
    // unless nothing closer exists — check it's reasonably close
    expect(q.difficulty).toBeGreaterThanOrEqual(3);
  });

  it("returns null when the bank is exhausted for a phase", () => {
    const allDesignIds = QUESTION_BANK.filter((q) => q.phase === "design").map((q) => q.id);
    expect(pickQuestion("design", 3, allDesignIds)).toBeNull();
  });
});