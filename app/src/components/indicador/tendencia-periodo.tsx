"use client";

import * as React from "react";
import { TrendChart } from "@/components/ui/trend-chart";
import { cn, formatNumber } from "@/lib/utils";
import type { Kpi } from "@/lib/indicadores/tipos";

export function IndicadorTendenciaPeriodo({ kpi }: { kpi: Kpi }) {
  const tiene26 = !!kpi.serie26;
  const [rango, setRango] = React.useState<12 | 26>(tiene26 ? 26 : 12);
  const serie = rango === 26 && kpi.serie26 ? kpi.serie26 : kpi.serie;

  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[15px] font-semibold tracking-[-0.005em]">Tendencia</h2>
          <p className="text-[13px] text-fg-2">Pasa el cursor por la línea para ver cada semana.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-fg-2">
            <span aria-hidden className="h-[3px] w-3 rounded-full bg-primary" />
            {kpi.nombre}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-fg-2">
            <span aria-hidden className="h-0 w-3 border-t-2 border-dashed border-target" />
            Meta {formatNumber(kpi.meta, kpi.decimales)}
          </span>
          {tiene26 && (
            <div role="group" aria-label="Periodo" className="flex gap-0.5 rounded-lg border border-border bg-surface-2 p-0.5">
              <button
                type="button"
                aria-pressed={rango === 12}
                onClick={() => setRango(12)}
                className={cn("h-7 rounded-md px-2.5 text-[13px] font-medium text-fg-2 hover:text-fg", rango === 12 && "shadow-hover bg-surface text-fg")}
              >
                12 semanas
              </button>
              <button
                type="button"
                aria-pressed={rango === 26}
                onClick={() => setRango(26)}
                className={cn("h-7 rounded-md px-2.5 text-[13px] font-medium text-fg-2 hover:text-fg", rango === 26 && "shadow-hover bg-surface text-fg")}
              >
                26 semanas
              </button>
            </div>
          )}
        </div>
      </div>
      <TrendChart
        serie={serie}
        meta={kpi.meta}
        unidad={kpi.unidad}
        decimales={kpi.decimales}
        mayorEsMejor={kpi.comparacion === "mayor-mejor"}
        className="h-[300px]"
      />
    </section>
  );
}
