"use client";

import * as React from "react";
import Link from "next/link";
import { StatusChip } from "@/components/ui/status-chip";
import { ProgressBullet } from "@/components/ui/progress-bullet";
import { TrendChart } from "@/components/ui/trend-chart";
import { cn, formatNumber } from "@/lib/utils";
import { kpis, metaEsLimite, type Kpi } from "@/lib/demo-data";

const PRIMERA_SEMANA = 36;

/**
 * Franja de indicadores (pestañas) + gráfico de tendencia del seleccionado.
 * Un solo componente porque ambos comparten el estado "qué indicador está
 * activo" — docs/DESIGN.md v2 §4 "Franja de indicadores (patrón principal)".
 */
export function IndicadoresConTendencia() {
  const [activoSlug, setActivoSlug] = React.useState<string>(kpis[0].slug);
  const activo = kpis.find((k) => k.slug === activoSlug) ?? kpis[0];

  return (
    <div className="flex flex-col gap-6">
      <section aria-label="Indicadores de tu área" className="overflow-hidden rounded-xl border border-border bg-surface">
        <div
          role="tablist"
          aria-label="Indicador del gráfico"
          className="grid gap-px bg-border"
          style={{ gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))` }}
        >
          {kpis.map((k) => (
            <CeldaIndicador key={k.slug} kpi={k} seleccionado={k.slug === activoSlug} onSeleccionar={() => setActivoSlug(k.slug)} />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[15px] font-semibold tracking-[-0.005em]">{activo.tendencia.titulo}</h2>
            <p className="tabular text-[13px] text-fg-2">{activo.tendencia.subtitulo}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-fg-2">
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="h-[3px] w-3 rounded-full bg-primary" />
              {activo.tendencia.leyenda}
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="h-0 w-3 border-t-2 border-dashed border-target" />
              {metaEsLimite[activo.slug] ? "Límite" : "Meta"}
            </span>
            <Link href={`/indicadores/${activo.slug}`} className="font-medium">
              Ver detalle
            </Link>
          </div>
        </div>
        <TrendChart
          serie={activo.serie}
          meta={activo.meta}
          metaEsLimite={metaEsLimite[activo.slug]}
          unidad={activo.unidad}
          decimales={activo.slug === "seguridad" ? 1 : 0}
          mayorEsMejor={activo.comparacion === "mayor-mejor"}
          primeraSemana={PRIMERA_SEMANA}
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
      onClick={onSeleccionar}
      className={cn("flex flex-col gap-2.5 bg-surface p-5 text-left transition-colors hover:bg-surface-2", seleccionado && "bg-sel hover:bg-sel")}
    >
      <span className="flex items-center justify-between gap-2">
        <span className={cn("text-[13px] font-medium text-fg-2", seleccionado && "text-primary")}>{kpi.nombre}</span>
        <StatusChip estado={kpi.estado} />
      </span>
      <span className="tabular flex items-baseline gap-1.5">
        <span className="text-[28px] font-semibold leading-none tracking-[-0.02em] text-fg">
          {formatNumber(kpi.valorActual, kpi.slug === "seguridad" ? 0 : undefined)}
        </span>
        <span className="text-[13px] font-medium text-fg-3">{kpi.unidad}</span>
      </span>
      <ProgressBullet valor={kpi.valorActual} meta={kpi.meta} estado={kpi.estado} />
      <span className="tabular text-xs text-fg-3">{kpi.caption}</span>
    </button>
  );
}
