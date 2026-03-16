import { describe, expect, it } from "vitest";
import { scoreBallot } from "@/lib/scoring/engine";

describe("scoreBallot", () => {
  const picks = [
    { categoryId: "1", nomineeId: "A", points: 5, isMajor: true, winnerNomineeId: "A", confidenceRank: 1 },
    { categoryId: "2", nomineeId: "B", points: 3, isMajor: false, winnerNomineeId: "C", confidenceRank: 2 }
  ];

  it("scores standard mode", () => {
    expect(scoreBallot(picks, "STANDARD").points).toBe(5);
  });

  it("scores weighted mode", () => {
    expect(scoreBallot(picks, "WEIGHTED").points).toBe(7);
  });

  it("scores party mode", () => {
    expect(scoreBallot(picks, "PARTY").points).toBe(10);
  });
});
