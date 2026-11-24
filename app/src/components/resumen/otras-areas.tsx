import { TrendingDown, TrendingUp } from "lucide-react";
import { indicadoresOtrasAreas } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export function OtrasAreas() {
  return (
    <section aria-label="Indicadores de otras áreas" className="flex flex-1 flex-col rounded-xl border border-border bg-surface px-5 pb-2 pt-4">
      <h2 className="text-[15px] font-semibold tracking-[-0.005em]">Indicadores de otras áreas</h2>
      <p className="text-[13px] text-fg-3">Cambio frente a la semana anterior</p>
      <ul className="mt-1.5 flex flex-1 flex-col divide-y divide-border">
        {indicadoresOtrasAreas.map((indicador) => {
          const Flecha = indicador.arriba ? TrendingUp : TrendingDown;
          return (
            <li key={indicador.nombre} className="tabular flex max-h-20 flex-1 items-center justify-between gap-3 py-2">
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm text-fg">{indicador.nombre}</span>
                <span className="text-xs text-fg-3">
                  {indicador.area} · {indicador.recibido}
                </span>
              </span>
              <span className="flex shrink-0 flex-col items-end">
                <span className="text-sm font-semibold text-fg">{indicador.valor}</span>
                <span className={cn("flex items-center gap-1 text-xs font-medium", indicador.bueno ? "text-ok-fg" : "text-risk-fg")}>
                  <Flecha className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
                  <span className="sr-only">{indicador.arriba ? "Subió" : "Bajó"}</span>
                  {indicador.delta}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
