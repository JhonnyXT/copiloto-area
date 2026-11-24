import { Check, TrendingDown, TrendingUp, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Estado } from "@/lib/demo-data";

const estilos: Record<Estado, string> = {
  cumple: "bg-success-soft text-success-soft-foreground",
  atencion: "bg-warning-soft text-warning-soft-foreground",
  riesgo: "bg-danger-soft text-danger-soft-foreground",
};

const iconos: Record<Estado, React.ElementType> = {
  cumple: Check,
  atencion: TriangleAlert,
  riesgo: TrendingUp,
};

/**
 * Insignia de estado: siempre icono + texto, nunca solo color.
 * docs/DESIGN.md §4.
 */
export function StatusBadge({
  estado,
  children,
  className,
}: {
  estado: Estado;
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = estado === "riesgo" ? TrendingUp : iconos[estado];
  return (
    <span
      className={cn(
        "tabular inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold",
        estilos[estado],
        className,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden strokeWidth={2.5} />
      {children}
    </span>
  );
}

export function TrendIcon({ up, className }: { up: boolean; className?: string }) {
  const Icon = up ? TrendingUp : TrendingDown;
  return <Icon className={cn("h-3.5 w-3.5", className)} aria-hidden />;
}
