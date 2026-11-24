"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function BotonEntrarConGoogle() {
  const [cargando, setCargando] = React.useState(false);
  const [errorLocal, setErrorLocal] = React.useState<string | null>(null);
  const params = useSearchParams();
  const destino = params.get("desde") || "/";

  // El error de "correo no autorizado" se lanza en el servidor, al final
  // del ida-y-vuelta con Google, no en esta llamada — por eso llega como
  // parámetro de la URL de regreso (errorCallbackURL) y se deriva aquí
  // directamente del render, sin un efecto.
  const error = params.get("error")
    ? "Este correo no está autorizado para entrar al piloto. Habla con Jonathan si crees que debería estarlo."
    : errorLocal;

  async function entrar() {
    setErrorLocal(null);
    setCargando(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: destino,
      errorCallbackURL: "/entrar?error=no-autorizado",
    });
    if (error) {
      setErrorLocal("No se pudo iniciar sesión. Intenta de nuevo.");
      setCargando(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <button
        type="button"
        onClick={entrar}
        disabled={cargando}
        className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-border-strong bg-surface text-sm font-medium text-fg hover:bg-surface-2 disabled:opacity-60"
      >
        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.89c2.27-2.09 3.58-5.17 3.58-8.82Z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.89-3c-1.08.73-2.46 1.16-4.06 1.16-3.12 0-5.77-2.11-6.71-4.94H1.27v3.1A12 12 0 0 0 12 24Z" />
          <path fill="#FBBC05" d="M5.29 14.31A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.58.38-2.31v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.41Z" />
          <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.59l4.02 3.1C6.23 6.86 8.88 4.75 12 4.75Z" />
        </svg>
        {cargando ? "Entrando…" : "Continuar con Google"}
      </button>
      {error && (
        <p role="alert" className="text-left text-[13px] text-risk-fg">
          {error}
        </p>
      )}
    </div>
  );
}
