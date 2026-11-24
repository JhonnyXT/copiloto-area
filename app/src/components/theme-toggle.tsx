"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaMontado } from "@/lib/use-ha-montado";

/**
 * Control segmentado Claro | Oscuro — nunca un botón que alterna a ciegas,
 * el estado actual siempre se ve. docs/DESIGN.md v2 §4.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const montado = useHaMontado();

  const esOscuro = montado && resolvedTheme === "dark";

  return (
    <div
      role="group"
      aria-label="Apariencia"
      className={cn("inline-flex gap-0.5 rounded-lg border border-border bg-surface-2 p-0.5", className)}
    >
      <button
        type="button"
        aria-pressed={!esOscuro}
        onClick={() => setTheme("light")}
        className={cn(
          "flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-fg-2 hover:text-fg",
          !esOscuro && "shadow-hover bg-surface text-fg",
        )}
      >
        <Sun className="h-3.5 w-3.5" aria-hidden strokeWidth={1.75} />
        Claro
      </button>
      <button
        type="button"
        aria-pressed={esOscuro}
        onClick={() => setTheme("dark")}
        className={cn(
          "flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-fg-2 hover:text-fg",
          esOscuro && "shadow-hover bg-surface text-fg",
        )}
      >
        <Moon className="h-3.5 w-3.5" aria-hidden strokeWidth={1.75} />
        Oscuro
      </button>
    </div>
  );
}
