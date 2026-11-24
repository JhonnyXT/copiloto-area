import { Check, TrendingDown, TrendingUp, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Estado } from "@/lib/demo-data";

const estilos: Record<Estado, string> = {
  ok: "bg-ok-soft text-ok-fg",
  warn: "bg-warn-soft text-warn-fg",
  risk: "bg-risk-soft text-risk-fg",
};

const iconos: Record<Estado, React.ElementType> = {
  ok: Check,
  warn: TriangleAlert,
  risk: TrendingUp,
};

const textoPorDefecto: Record<Estado, string> = {
  ok: "En meta",
  warn: "Atención",
  risk: "En riesgo",
};

export function StatusChip({
  estado,
  children,
  className,
}: {
  estado: Estado;
  children?: React.ReactNode;
  className?: string;
}) {
  const Icon = iconos[estado];
  return (
    <span
      className={cn(
        "tabular inline-flex h-[22px] items-center gap-1 whitespace-nowrap rounded-full px-2 text-xs font-medium",
        estilos[estado],
        className,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden strokeWidth={2.25} />
      {children ?? textoPorDefecto[estado]}
    </span>
  );
}

export function TrendArrow({ up, className }: { up: boolean; className?: string }) {
  const Icon = up ? TrendingUp : TrendingDown;
  return <Icon className={cn("h-3.5 w-3.5", className)} aria-hidden />;
}
