import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  const user = await db.user.findUniqueOrThrow({ where: { email: session.user.email } });
  const team = await db.coupleTeam.create({ data: { name } });
  await db.coupleMembership.create({ data: { userId: user.id, teamId: team.id, role: "CAPTAIN" } });
  return NextResponse.json({ ok: true, teamId: team.id });
}
