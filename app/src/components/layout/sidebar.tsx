"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { BotonCerrarSesion, BotonTema } from "@/components/layout/acciones-cuenta";
import { CommandPalette } from "@/components/layout/command-palette";
import { esSeccionActiva, SECCIONES } from "@/components/layout/navegacion";
import { authClient } from "@/lib/auth-client";
import { area } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { data: sesion } = authClient.useSession();
  const nombre = sesion?.user.name ?? area.usuario;

  return (
    <div className={cn("flex w-58 shrink-0 flex-col gap-5 overflow-y-auto border-r border-border p-3", className)}>
      <Link href="/" className="flex items-center gap-2.5 rounded-lg px-1.5 pt-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
          <Zap className="h-4 w-4" aria-hidden fill="currentColor" strokeWidth={0} />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-fg">Copiloto</span>
          <span className="text-xs text-fg-3">{area.nombre}</span>
        </span>
      </Link>

      <CommandPalette />

      <nav aria-label="Principal" className="flex flex-1 flex-col gap-0.5">
        {SECCIONES.map(({ href, label, icono: Icono, prefijo }) => {
          const activa = esSeccionActiva(prefijo, pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={activa ? "page" : undefined}
              className={cn(
                "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium",
                activa ? "bg-primary-soft text-primary-soft-fg" : "text-fg-2 hover:bg-hover hover:text-fg",
              )}
            >
              <Icono className="h-[18px] w-[18px] shrink-0" aria-hidden strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-0.5">
        <BotonTema />
        <BotonCerrarSesion />
        <div className="mt-2 flex items-center gap-2.5 border-t border-border px-1.5 pt-3">
          <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[13px] font-semibold text-primary-soft-fg">
            {nombre[0]}
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-[13px] font-semibold text-fg">{nombre}</span>
            <span className="truncate text-xs text-fg-3">{area.rol}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
