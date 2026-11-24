import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CommandPalette } from "@/components/layout/command-palette";
import { ThemeToggleIcon } from "@/components/theme-toggle-icon";
import { formatDateTime } from "@/lib/utils";
import { area } from "@/lib/demo-data";

export function Topbar({ ruta }: { ruta: { label: string; href?: string }[] }) {
  return (
    <header className="flex h-14 shrink-0 flex-nowrap items-center gap-3 border-b border-border bg-surface px-4 md:gap-4 md:px-7">
      <nav aria-label="Ruta" className="hidden shrink-0 items-center gap-1.5 text-[13px] text-fg-3 md:flex">
        {ruta.map((paso, i) => (
          <span key={paso.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
            {paso.href ? (
              <Link href={paso.href} className="text-fg-3 hover:text-fg">
                {paso.label}
              </Link>
            ) : (
              <span className="font-medium text-fg">{paso.label}</span>
            )}
          </span>
        ))}
      </nav>

      <CommandPalette className="min-w-0 flex-1 md:ml-4 md:w-80 md:flex-none" />

      <span className="tabular hidden shrink-0 items-center gap-2 text-[13px] text-fg-3 lg:ml-auto lg:flex">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ok" />
        Datos al {formatDateTime(area.ultimaCarga)}
      </span>
      <ThemeToggleIcon className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-surface text-fg hover:bg-surface-2 md:hidden" />
    </header>
  );
}
