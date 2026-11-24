"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { esSeccionActiva, SECCIONES } from "@/components/layout/navegacion";
import { cn } from "@/lib/utils";

export function MobileTabbar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {SECCIONES.map((tab) => {
        const activo = esSeccionActiva(tab.prefijo, pathname);
        const Icon = tab.icono;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={activo ? "page" : undefined}
            className={cn("flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-fg-3", activo && "text-primary")}
          >
            <Icon className="h-[22px] w-[22px]" aria-hidden strokeWidth={activo ? 2.1 : 1.75} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
