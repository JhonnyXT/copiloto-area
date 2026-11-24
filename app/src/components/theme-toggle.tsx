"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Selector claro/oscuro: un interruptor de dos posiciones, no un botón que
 * alterna a ciegas — el estado actual siempre se ve. docs/DESIGN.md §2.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "group relative inline-flex h-9 w-[68px] shrink-0 items-center rounded-full border border-border bg-muted px-1 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Sun className="pointer-events-none absolute left-2 h-4 w-4 text-subtle-foreground" aria-hidden />
      <Moon className="pointer-events-none absolute right-2 h-4 w-4 text-subtle-foreground" aria-hidden />
      <span
        className={cn(
          "pointer-events-none z-10 flex h-7 w-7 items-center justify-center rounded-full bg-card shadow-hover transition-transform duration-200 ease-out",
          isDark ? "translate-x-[30px]" : "translate-x-0",
        )}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-primary" aria-hidden />
        ) : (
          <Sun className="h-3.5 w-3.5 text-accent" aria-hidden />
        )}
      </span>
    </button>
  );
}
