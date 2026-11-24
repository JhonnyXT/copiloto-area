"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProgressBullet } from "@/components/ui/progress-bullet";
import { StatusChip } from "@/components/ui/status-chip";
import { TrendChart } from "@/components/ui/trend-chart";
import type { Kpi } from "@/lib/indicadores/tipos";
import { cn, formatNumber } from "@/lib/utils";

const PANEL_ID = "panel-tendencia";

export function IndicadoresConTendencia({ kpis }: { kpis: Kpi[] }) {
  const [activoSlug, setActivoSlug] = React.useState(kpis[0].slug);
  const activo = kpis.find((kpi) => kpi.slug === activoSlug) ?? kpis[0];

  return (
    <div className="@container flex min-w-0 flex-col gap-4">
      <div
        role="tablist"
        aria-label="Indicadores de tu área"
        className="grid shrink-0 grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border @sm:grid-cols-2 @4xl:grid-cols-4"
      >
        {kpis.map((kpi) => (
          <CeldaIndicador key={kpi.slug} kpi={kpi} seleccionado={kpi.slug === activo.slug} onSeleccionar={() => setActivoSlug(kpi.slug)} />
        ))}
      </div>

      <section id={PANEL_ID} role="tabpanel" aria-label={activo.nombre} className="flex min-h-60 flex-1 flex-col rounded-xl border border-border bg-surface p-5 max-lg:min-h-80">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[15px] font-semibold tracking-[-0.005em]">{activo.tendencia.titulo}</h2>
            <p className="tabular text-[13px] text-fg-2">{activo.tendencia.subtitulo}</p>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-fg-2">
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="h-0 w-4 border-t-2 border-dashed border-target" />
              Meta
            </span>
            <Link href={`/indicadores/${activo.slug}`} className="flex items-center gap-0.5 font-medium text-primary hover:underline">
              Ver detalle
              <ChevronRight className="h-4 w-4" aria-hidden strokeWidth={1.75} />
            </Link>
          </div>
        </div>
        <TrendChart
          serie={activo.serie}
          meta={activo.meta}
          unidad={activo.unidad}
          decimales={activo.decimales}
          mayorEsMejor={activo.comparacion === "mayor-mejor"}
          className="min-h-32 flex-1"
        />
      </section>
    </div>
  );
}

function CeldaIndicador({ kpi, seleccionado, onSeleccionar }: { kpi: Kpi; seleccionado: boolean; onSeleccionar: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={seleccionado}
      aria-controls={PANEL_ID}
      onClick={onSeleccionar}
      className={cn(
        "flex flex-col gap-2.5 p-4 text-left transition-colors focus-visible:-outline-offset-2",
        seleccionado ? "bg-sel" : "bg-surface hover:bg-surface-2",
      )}
    >
      <span className="flex w-full flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <span className={cn("text-[13px] font-medium", seleccionado ? "text-primary" : "text-fg-2")}>{kpi.nombre}</span>
        <StatusChip estado={kpi.estado} />
      </span>
      <span className="tabular flex items-baseline gap-1.5">
        <span className="text-[28px] font-semibold leading-none tracking-[-0.02em] text-fg">{formatNumber(kpi.valorActual, kpi.decimales)}</span>
        <span className="text-[13px] text-fg-3">{kpi.unidad}</span>
      </span>
      <ProgressBullet valor={kpi.valorActual} meta={kpi.meta} estado={kpi.estado} className="w-full" />
      <span className="tabular text-xs text-fg-3">{kpi.caption}</span>
    </button>
  );
}
