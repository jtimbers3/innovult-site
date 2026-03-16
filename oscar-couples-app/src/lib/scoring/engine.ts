import { PickInput, ScoreResult, ScoringMode } from "@/types/scoring";

export function scoreBallot(picks: PickInput[], mode: ScoringMode): ScoreResult {
  return picks.reduce(
    (acc, pick) => {
      const isCorrect = pick.winnerNomineeId && pick.winnerNomineeId === pick.nomineeId;
      acc.totalPicks += 1;
      if (!isCorrect) return acc;

      acc.correctPicks += 1;
      if (mode === "STANDARD") acc.points += pick.points;
      if (mode === "WEIGHTED") acc.points += pick.points + (pick.isMajor ? 2 : 0);
      if (mode === "PARTY") {
        const confidence = pick.confidenceRank ? Math.max(0, 6 - pick.confidenceRank) : 0;
        acc.points += pick.points + confidence;
      }
      return acc;
    },
    { points: 0, correctPicks: 0, totalPicks: 0 } as ScoreResult
  );
}
