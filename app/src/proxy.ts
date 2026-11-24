import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const VALOR_BYPASS_SOLO_PRUEBAS = "solo-para-playwright-nunca-en-produccion";

export function proxy(request: NextRequest) {
  const esBypassDePruebas = process.env.E2E_BYPASS_AUTH === VALOR_BYPASS_SOLO_PRUEBAS;
  if (esBypassDePruebas || getSessionCookie(request)) {
    return NextResponse.next();
  }

  const urlEntrar = new URL("/entrar", request.url);
  urlEntrar.searchParams.set("desde", request.nextUrl.pathname);
  return NextResponse.redirect(urlEntrar);
}

export const config = {
  matcher: ["/((?!entrar|api/auth|_next|favicon.ico|fonts).*)"],
};
