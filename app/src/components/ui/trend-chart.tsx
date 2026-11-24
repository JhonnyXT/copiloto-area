"use client";

import * as React from "react";
import { cn, formatNumber } from "@/lib/utils";

interface TrendChartProps {
  serie: number[];
  meta: number;
  unidad: string;
  height?: number;
  className?: string;
  /** Etiquetas del eje X (una por punto); si se omite, se numeran semanas. */
  labels?: string[];
}

/**
 * Gráfico de línea con área, meta punteada y tooltip real al pasar el mouse
 * o el foco del teclado — no una imagen estática. Un punto = una semana.
 */
export function TrendChart({ serie, meta, unidad, height = 220, className, labels }: TrendChartProps) {
  const width = 1000;
  const padTop = 12;
  const padBottom = 28;
  const plotH = height - padTop - padBottom;

  const values = [...serie, meta];
  const lo = Math.min(...values) * 0.98;
  const hi = Math.max(...values) * 1.02;
  const range = hi - lo || 1;

  const x = (i: number) => (i / (serie.length - 1)) * width;
  const y = (v: number) => padTop + (1 - (v - lo) / range) * plotH;

  const points = serie.map((v, i) => [x(i), y(v)] as const);
  const linePath = points.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${width},${height - padBottom} L0,${height - padBottom} Z`;
  const metaY = y(meta);

  const [active, setActive] = React.useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  function handleMove(clientX: number) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const idx = Math.round(ratio * (serie.length - 1));
    setActive(Math.max(0, Math.min(serie.length - 1, idx)));
  }

  const gradId = React.useId();

  return (
    <div className={cn("relative select-none", className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="block h-auto w-full overflow-visible"
        style={{ height }}
        role="img"
        aria-label={`Tendencia de ${serie.length} semanas, valor actual ${formatNumber(serie.at(-1) ?? 0, serie.at(-1)! % 1 ? 1 : 0)} ${unidad}, meta ${formatNumber(meta)} ${unidad}`}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseLeave={() => setActive(null)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={() => setActive(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-primary)" stopOpacity="0.16" />
            <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((f) => (
          <line
            key={f}
            x1={0}
            x2={width}
            y1={padTop + f * plotH}
            y2={padTop + f * plotH}
            stroke="var(--color-border)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <path d={areaPath} fill={`url(#${gradId})`} />

        <line
          x1={0}
          x2={width}
          y1={metaY}
          y2={metaY}
          stroke="var(--color-subtle-foreground)"
          strokeWidth={1.5}
          strokeDasharray="6 5"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d={linePath}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {active !== null && (
          <>
            <line
              x1={points[active][0]}
              x2={points[active][0]}
              y1={padTop}
              y2={height - padBottom}
              stroke="var(--color-subtle-foreground)"
              strokeWidth={1}
              strokeOpacity={0.5}
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={points[active][0]}
              cy={points[active][1]}
              r={5}
              fill="var(--color-card)"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
            />
          </>
        )}
      </svg>

      {active !== null && (
        <div
          className="tabular shadow-float pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground"
          style={{
            left: `${(points[active][0] / width) * 100}%`,
            top: `${Math.max(0, (points[active][1] / height) * 100 - 6)}%`,
          }}
        >
          <div className="font-semibold">
            {labels?.[active] ?? `Semana ${active + 1}`} · {formatNumber(serie[active], serie[active] % 1 ? 1 : 0)} {unidad}
          </div>
          <div
            className={cn(
              "text-[11px]",
              serie[active] >= meta ? "text-success" : "text-danger",
            )}
          >
            {serie[active] >= meta ? "+" : ""}
            {formatNumber(serie[active] - meta, 1)} {unidad} vs. meta
          </div>
        </div>
      )}

      <div className="tabular mt-1 flex justify-between text-[11px] text-subtle-foreground">
        {labels ? (
          labels.filter((_, i) => i % Math.ceil(labels.length / 6) === 0).map((l) => <span key={l}>{l}</span>)
        ) : (
          <>
            <span>S{48 - serie.length + 1}</span>
            <span>S{48 - serie.length + Math.round(serie.length / 2)}</span>
            <span>S{48 - 1}</span>
          </>
        )}
      </div>
    </div>
  );
}
