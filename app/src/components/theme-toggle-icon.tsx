"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useHaMontado } from "@/lib/use-ha-montado";

export function ThemeToggleIcon({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const montado = useHaMontado();
  const esOscuro = montado && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={esOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={() => setTheme(esOscuro ? "light" : "dark")}
      className={className ?? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-surface text-fg hover:bg-surface-2"}
    >
      {esOscuro ? <Moon className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.75} /> : <Sun className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.75} />}
    </button>
  );
}
