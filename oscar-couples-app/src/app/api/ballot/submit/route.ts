import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { awardsYearId, picks } = await req.json() as { awardsYearId: string; picks: Array<{ categoryId: string; nomineeId: string; confidenceRank?: number }>; };
  const user = await db.user.findUniqueOrThrow({ where: { email: session.user.email }, include: { teamMembership: true } });
  if (!user.teamMembership) return NextResponse.json({ error: "No team" }, { status: 400 });

  const year = await db.awardsYear.findUniqueOrThrow({ where: { id: awardsYearId } });
  if (new Date() >= year.ballotLockAt) return NextResponse.json({ error: "Ballot locked" }, { status: 400 });

  const ballot = await db.ballot.upsert({
    where: { awardsYearId_teamId: { awardsYearId, teamId: user.teamMembership.teamId } },
    update: { submittedAt: new Date(), isLocked: true },
    create: { awardsYearId, teamId: user.teamMembership.teamId, userId: user.id, submittedAt: new Date(), isLocked: true }
  });

  await db.ballotPick.deleteMany({ where: { ballotId: ballot.id } });
  await db.ballotPick.createMany({
    data: picks.map((p) => ({ ballotId: ballot.id, categoryId: p.categoryId, nomineeId: p.nomineeId, confidenceRank: p.confidenceRank }))
  });

  return NextResponse.json({ ok: true });
}
