import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Registro cerrado: sin sesión, no se entra a nada salvo /entrar y las
 * rutas propias de Better Auth. Solo revisa la cookie (rápido, sin tocar la
 * base de datos) — el chequeo de verdad va en cada página con
 * `auth.api.getSession()`. Ver skill de auth de Vercel: nunca llamar a la
 * base de datos desde aquí.
 */
export function proxy(request: NextRequest) {
  // Atajo SOLO para las pruebas de Playwright, que no pueden hacer el ida y
  // vuelta real con Google. Exige un valor exacto y largo (no basta con
  // poner "1" por accidente). ⚠️ Esta variable NUNCA debe existir en Vercel
  // ni en ningún .env que se despliegue — ver .env.example y CLAUDE.md.
  const esAtajoDePruebas = process.env.E2E_BYPASS_AUTH === "solo-para-playwright-nunca-en-produccion";
  if (!esAtajoDePruebas && !getSessionCookie(request)) {
    const entrar = new URL("/entrar", request.url);
    entrar.searchParams.set("desde", request.nextUrl.pathname);
    return NextResponse.redirect(entrar);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!entrar|api/auth|_next|favicon.ico|fonts).*)"],
};
