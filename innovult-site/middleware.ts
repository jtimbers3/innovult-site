import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/play/diamond-quest-7kq4") {
    return NextResponse.rewrite(new URL("/diamond-quest-7kq4/index.html", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/play/diamond-quest-7kq4",
};
