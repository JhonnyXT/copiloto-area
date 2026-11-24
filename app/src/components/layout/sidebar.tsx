"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileBarChart, FileText, LayoutDashboard, Search, UploadCloud, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { area } from "@/lib/demo-data";

const nav = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  { href: "/indicadores/costo-onza", label: "Indicadores", icon: FileBarChart, match: "/indicadores" },
  { href: "/informes", label: "Informes", icon: FileText },
  { href: "/documentos", label: "Documentos", icon: Search },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Principal"
      className={cn(
        "flex w-62 shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar px-3 py-6",
        className,
      )}
    >
      <Link href="/" className="flex items-center gap-3 px-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
          <Zap className="h-5 w-5" aria-hidden fill="currentColor" strokeWidth={0} />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[17px] font-semibold text-sidebar-foreground">Copiloto</span>
          <span className="text-xs text-subtle-foreground">de área · Joblan</span>
        </span>
      </Link>

      <div className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = item.match ? pathname.startsWith(item.match) : pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-foreground",
                active && "shadow-hover bg-sidebar-accent text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/documentos?cargar=1"
          className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <UploadCloud className="h-[18px] w-[18px] shrink-0" aria-hidden strokeWidth={1.8} />
          Cargar datos
        </Link>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent p-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary-soft-foreground">
          {area.usuario[0]}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-sidebar-foreground">{area.usuario}</span>
          <span className="truncate text-xs text-subtle-foreground">{area.rol}</span>
        </span>
      </div>
    </nav>
  );
}
