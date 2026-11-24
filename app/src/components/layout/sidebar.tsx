"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsUpDown, FileBarChart, FileText, LayoutDashboard, MoreHorizontal, Search, UploadCloud, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { area } from "@/lib/demo-data";
import { ThemeToggle } from "@/components/theme-toggle";

const navPrincipal = [
  { href: "/", label: "Resumen", icon: LayoutDashboard },
  { href: "/indicadores/costo-onza", label: "Indicadores", icon: FileBarChart, match: "/indicadores" },
  { href: "/informes", label: "Informes", icon: FileText },
  { href: "/documentos", label: "Documentos", icon: Search },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Principal"
      className={cn("flex w-58 shrink-0 flex-col gap-5 border-r border-border px-3 py-4", className)}
    >
      <Link href="/" className="flex items-center gap-2.5 px-1.5 py-1">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-primary text-on-primary">
          <Zap className="h-4 w-4" aria-hidden fill="currentColor" strokeWidth={0} />
        </span>
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-fg">Copiloto</span>
      </Link>

      <button
        type="button"
        className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-surface px-2.5 py-2 text-left hover:bg-surface-2"
      >
        <span className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate text-[13px] font-semibold text-fg">{area.nombre}</span>
          <span className="truncate text-xs text-fg-3">Piloto · datos de ejemplo</span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-fg-3" aria-hidden strokeWidth={1.75} />
      </button>

      <div className="flex flex-col gap-0.5">
        <span className="mb-1 px-2.5 text-xs font-medium text-fg-3">General</span>
        {navPrincipal.map((item) => {
          const activo = item.match ? pathname.startsWith(item.match) : pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activo ? "page" : undefined}
              className={cn(
                "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-fg-2 hover:bg-surface-2 hover:text-fg",
                activo && "shadow-hover bg-surface text-fg",
              )}
            >
              <Icon className={cn("h-[18px] w-[18px] shrink-0", activo && "text-primary")} aria-hidden strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}

        <span className="mb-1 mt-4 px-2.5 text-xs font-medium text-fg-3">Datos</span>
        <Link
          href="/documentos?cargar=1"
          className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-fg-2 hover:bg-surface-2 hover:text-fg"
        >
          <UploadCloud className="h-[18px] w-[18px] shrink-0" aria-hidden strokeWidth={1.75} />
          Cargas de datos
        </Link>
      </div>

      <div className="flex-1" />

      <div className="flex flex-col gap-2">
        <span className="px-2.5 text-xs font-medium text-fg-3">Apariencia</span>
        <ThemeToggle className="w-full" />
      </div>

      <button
        type="button"
        className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left hover:bg-surface-2"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[13px] font-semibold text-primary-soft-fg">
          {area.usuario[0]}
        </span>
        <span className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate text-[13px] font-semibold text-fg">{area.usuario}</span>
          <span className="truncate text-xs text-fg-3">{area.rol}</span>
        </span>
        <MoreHorizontal className="h-4 w-4 shrink-0 text-fg-3" aria-hidden />
      </button>
    </nav>
  );
}
