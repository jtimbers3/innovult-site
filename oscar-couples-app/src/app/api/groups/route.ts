import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name } = await req.json();
  const user = await db.user.findUniqueOrThrow({ where: { email: session.user.email } });
  const group = await db.group.create({
    data: { name, createdByUserId: user.id, inviteCode: randomBytes(3).toString("hex").toUpperCase(), isPrivate: true }
  });
  await db.groupMembership.create({ data: { groupId: group.id, userId: user.id, role: "HOST" } });
  return NextResponse.json({ ok: true, inviteCode: group.inviteCode });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { inviteCode } = await req.json();
  const user = await db.user.findUniqueOrThrow({ where: { email: session.user.email } });
  const group = await db.group.findUniqueOrThrow({ where: { inviteCode } });
  await db.groupMembership.upsert({
    where: { groupId_userId: { groupId: group.id, userId: user.id } },
    update: {},
    create: { groupId: group.id, userId: user.id }
  });
  return NextResponse.json({ ok: true });
}
