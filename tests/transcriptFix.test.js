import { describe, it, expect } from "vitest";
import { fixTranscript } from "../src/transcriptFix.js";

describe("fixTranscript", () => {
  it("corrects common speech-recognition mangling of MongoDB", () => {
    expect(fixTranscript("I used mongo db for storage")).toBe("I used MongoDB for storage");
  });

  it("corrects Node.js variants", () => {
    expect(fixTranscript("built with node js")).toBe("built with Node.js");
    expect(fixTranscript("built with no js")).toBe("built with Node.js");
  });

  it("corrects GitHub casing", () => {
    expect(fixTranscript("pushed it to git hub")).toBe("pushed it to GitHub");
  });

  it("leaves already-correct text unchanged", () => {
    expect(fixTranscript("I used React and Express")).toBe("I used React and Express");
  });

  it("trims surrounding whitespace", () => {
    expect(fixTranscript("  hello world  ")).toBe("hello world");
  });
});