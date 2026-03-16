import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const membership = await db.groupMembership.findFirst({
    where: { user: { email: session.user.email }, role: { in: ["HOST", "ADMIN"] } }
  });
  if (!membership) return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const { categoryId, nomineeId } = await req.json();
  await db.officialResult.upsert({
    where: { categoryId },
    update: { nomineeId, enteredByUser: session.user.email },
    create: { categoryId, nomineeId, enteredByUser: session.user.email }
  });

  return NextResponse.json({ ok: true });
}
