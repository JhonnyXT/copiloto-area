import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { esBypassDePruebasActivo } from "@/lib/e2e-bypass";

export function proxy(request: NextRequest) {
  if (esBypassDePruebasActivo() || getSessionCookie(request)) {
    return NextResponse.next();
  }

  const urlEntrar = new URL("/entrar", request.url);
  urlEntrar.searchParams.set("desde", request.nextUrl.pathname);
  return NextResponse.redirect(urlEntrar);
}

export const config = {
  matcher: ["/((?!entrar|api/auth|_next|favicon.ico|fonts).*)"],
};
