import { Suspense } from "react";
import { BotonEntrarConGoogle } from "./boton-entrar";

export default function EntrarPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg p-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-xl border border-border bg-surface p-8 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-primary text-on-primary">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m3 19 6-10 4 6 2-3 6 7z" />
          </svg>
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-semibold tracking-[-0.01em] text-fg">Copiloto de área</h1>
          <p className="text-sm text-fg-2">Piloto privado. Solo entran los correos autorizados.</p>
        </div>
        <Suspense fallback={null}>
          <BotonEntrarConGoogle />
        </Suspense>
        <p className="rounded-lg bg-banner-bg px-3 py-2 text-xs text-banner-fg">
          Estás viendo datos de ejemplo. Ninguna cifra ni documento de esta versión es real.
        </p>
      </div>
    </div>
  );
}
