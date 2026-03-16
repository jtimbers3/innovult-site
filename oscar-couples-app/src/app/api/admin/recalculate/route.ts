import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scoreBallot } from "@/lib/scoring/engine";

export async function POST() {
  const years = await db.awardsYear.findMany({ include: { categories: { include: { officialResult: true } } } });

  for (const year of years) {
    const ballots = await db.ballot.findMany({ where: { awardsYearId: year.id }, include: { picks: true } });
    for (const ballot of ballots) {
      const picks = ballot.picks.map((p) => {
        const cat = year.categories.find((c) => c.id === p.categoryId);
        return {
          categoryId: p.categoryId,
          nomineeId: p.nomineeId,
          points: cat?.points ?? 0,
          isMajor: cat?.isMajor ?? false,
          confidenceRank: p.confidenceRank,
          winnerNomineeId: cat?.officialResult?.nomineeId
        };
      });
      const result = scoreBallot(picks, year.scoringMode);
      await db.scoreSnapshot.upsert({
        where: { awardsYearId_teamId: { awardsYearId: year.id, teamId: ballot.teamId } },
        update: { points: result.points, correctPicks: result.correctPicks, totalPicks: result.totalPicks, updatedAt: new Date() },
        create: { awardsYearId: year.id, teamId: ballot.teamId, points: result.points, correctPicks: result.correctPicks, totalPicks: result.totalPicks }
      });
    }
  }

  return NextResponse.json({ ok: true });
}
