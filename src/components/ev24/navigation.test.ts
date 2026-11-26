import { describe, expect, it } from "vitest";
import { chapterProgress, clampSlide, slideFromHash } from "./navigation";

const chapters = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 4];

describe("EV24 deck navigation", () => {
  it("keeps navigation within the twelve slides", () => {
    expect(clampSlide(-4)).toBe(0);
    expect(clampSlide(99)).toBe(11);
    expect(clampSlide(Number.NaN)).toBe(0);
  });

  it("restores valid slide links and rejects unrelated hashes", () => {
    expect(slideFromHash("#s12")).toBe(11);
    expect(slideFromHash("#s99")).toBe(11);
    expect(slideFromHash("#s0")).toBe(0);
    expect(slideFromHash("#contacts")).toBe(0);
  });

  it("calculates progress within each chapter", () => {
    expect(chapterProgress(0, 0, chapters)).toBe(0.5);
    expect(chapterProgress(1, 0, chapters)).toBe(1);
    expect(chapterProgress(8, 4, chapters)).toBe(0.25);
    expect(chapterProgress(11, 4, chapters)).toBe(1);
  });
});
