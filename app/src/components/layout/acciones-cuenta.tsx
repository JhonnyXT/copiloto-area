"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LogOut, Moon, Sun } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useHaMontado } from "@/lib/use-ha-montado";
import { cn } from "@/lib/utils";

interface AccionCuentaProps {
  compacta?: boolean;
}

function BotonAccion({
  etiqueta,
  icono: Icono,
  onClick,
  compacta,
}: AccionCuentaProps & { etiqueta: string; icono: React.ElementType; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiqueta}
      className={cn(
        "flex h-9 items-center gap-2.5 rounded-lg text-sm font-medium text-fg-2 hover:bg-hover hover:text-fg",
        compacta ? "w-9 justify-center border border-border bg-surface" : "w-full px-2.5",
      )}
    >
      <Icono className="h-[18px] w-[18px] shrink-0" aria-hidden strokeWidth={1.75} />
      {!compacta && etiqueta}
    </button>
  );
}

export function BotonTema({ compacta }: AccionCuentaProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const montado = useHaMontado();
  const esOscuro = montado && resolvedTheme === "dark";

  return (
    <BotonAccion
      etiqueta={esOscuro ? "Modo claro" : "Modo oscuro"}
      icono={esOscuro ? Sun : Moon}
      onClick={() => setTheme(esOscuro ? "light" : "dark")}
      compacta={compacta}
    />
  );
}

export function BotonCerrarSesion({ compacta }: AccionCuentaProps) {
  const router = useRouter();

  async function cerrarSesion() {
    await authClient.signOut();
    router.push("/entrar");
    router.refresh();
  }

  return <BotonAccion etiqueta="Cerrar sesión" icono={LogOut} onClick={cerrarSesion} compacta={compacta} />;
}
