export type ScoringMode = "STANDARD" | "WEIGHTED" | "PARTY";

export type PickInput = {
  categoryId: string;
  nomineeId: string;
  points: number;
  isMajor: boolean;
  confidenceRank?: number | null;
  winnerNomineeId?: string | null;
};

export type ScoreResult = {
  points: number;
  correctPicks: number;
  totalPicks: number;
};
