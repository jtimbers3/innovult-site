import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  const passwordHash = await hash(password, 10);
  await db.user.create({ data: { name, email, passwordHash } });
  return NextResponse.json({ ok: true });
}
