"use client";

import * as React from "react";
import { cn, formatNumber, formatSigned } from "@/lib/utils";

const W = 600;
const PAD_TOP = 14;
const PAD_BOTTOM = 14;

interface TrendChartProps {
  serie: number[];
  meta: number;
  metaEsLimite?: boolean;
  unidad: string;
  decimales?: number;
  mayorEsMejor: boolean;
  primeraSemana: number;
  height?: number;
  className?: string;
}

export function TrendChart({
  serie,
  meta,
  metaEsLimite = false,
  unidad,
  decimales = 0,
  mayorEsMejor,
  primeraSemana,
  height = 220,
  className,
}: TrendChartProps) {
  const n = serie.length;
  const gradId = React.useId();
  const [activo, setActivo] = React.useState<number | null>(null);

  const { lo, hi } = React.useMemo(() => {
    const todos = [...serie, meta];
    const lo = Math.min(...todos);
    const hi = Math.max(...todos);
    const pad = (hi - lo) * 0.3 || 1;
    return { lo: lo - pad, hi: hi + pad };
  }, [serie, meta]);

  const x = React.useCallback((i: number) => (i / (n - 1)) * W, [n]);
  const y = React.useCallback(
    (v: number) => PAD_TOP + (1 - (v - lo) / (hi - lo)) * (height - PAD_TOP - PAD_BOTTOM),
    [lo, hi, height],
  );

  const linePath = serie.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${W},${height} L0,${height} Z`;
  const metaY = y(meta);
  const metaPath = `M0 ${metaY.toFixed(1)}H${W}`;

  const ticks = React.useMemo(() => {
    const out: { top: number; label: string }[] = [];
    for (let k = 0; k < 4; k++) {
      const v = hi - (k * (hi - lo)) / 3;
      out.push({ top: (y(v) / height) * 100, label: formatNumber(v, decimales) });
    }
    return out;
  }, [hi, lo, y, height, decimales]);

  const xLabels = React.useMemo(() => {
    const pasos = Math.min(6, n);
    const step = Math.max(1, Math.round((n - 1) / (pasos - 1)));
    const labels: string[] = [];
    for (let j = 0; j < pasos; j++) {
      const idx = j === pasos - 1 ? n - 1 : j * step;
      labels.push(`S${primeraSemana + idx}`);
    }
    return labels;
  }, [n, primeraSemana]);

  const hitInset = (-(100 / (n - 1)) / 2).toFixed(3) + "%";

  const semanaActiva = activo !== null ? serie[activo] : null;
  const diff = semanaActiva !== null ? semanaActiva - meta : null;
  const esBueno = diff !== null ? (mayorEsMejor ? diff >= 0 : diff <= 0) : null;
  const tx = activo === 0 ? "0%" : activo === n - 1 ? "-100%" : "-50%";

  return (
    <div className={cn("flex gap-3", className)}>
      <div
        aria-hidden
        className="tabular flex shrink-0 flex-col justify-between text-[11px] text-fg-3"
        style={{ width: 44, height, paddingBottom: 22 }}
      >
        {ticks.map((t) => (
          <span key={t.label} className="relative text-right" style={{ position: "absolute", top: `${t.top}%`, right: 0, transform: "translateY(-50%)" }}>
            {t.label}
          </span>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="relative" style={{ height }} onMouseLeave={() => setActivo(null)}>
          <svg
            role="img"
            aria-label={`Tendencia de ${n} semanas desde la semana ${primeraSemana}. Valor actual ${formatNumber(serie[n - 1], decimales)} ${unidad}; ${metaEsLimite ? "límite" : "meta"} ${formatNumber(meta, decimales)}.`}
            viewBox={`0 0 ${W} ${height}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--primary)" stopOpacity="0.14" />
                <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {ticks.map((t) => (
              <line key={t.label} x1={0} x2={W} y1={(t.top / 100) * height} y2={(t.top / 100) * height} stroke="var(--grid)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            ))}
            <path d={areaPath} fill={`url(#${gradId})`} />
            <path d={metaPath} stroke="var(--target)" strokeWidth={1.5} strokeDasharray="5 4" fill="none" vectorEffect="non-scaling-stroke" />
            <path d={linePath} stroke="var(--primary)" strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>

          <span
            aria-hidden
            className="absolute h-2.5 w-2.5 rounded-full border-2 border-primary bg-surface"
            style={{ left: `${(x(n - 1) / W) * 100}%`, top: `${(y(serie[n - 1]) / height) * 100}%`, marginLeft: -5, marginTop: -5 }}
          />

          {activo !== null && semanaActiva !== null && (
            <>
              <span
                aria-hidden
                className="absolute inset-y-0 w-px bg-border-strong"
                style={{ left: `${(x(activo) / W) * 100}%` }}
              />
              <span
                aria-hidden
                className="absolute h-2.5 w-2.5 rounded-full bg-primary"
                style={{
                  left: `${(x(activo) / W) * 100}%`,
                  top: `${(y(semanaActiva) / height) * 100}%`,
                  marginLeft: -5,
                  marginTop: -5,
                  boxShadow: "0 0 0 3px var(--surface)",
                }}
              />
              <div
                className="tabular shadow-pop pointer-events-none absolute z-10 min-w-[150px] rounded-lg border border-border bg-surface px-2.5 py-2 text-xs leading-relaxed"
                style={{
                  left: `${(x(activo) / W) * 100}%`,
                  top: `${(y(semanaActiva) / height) * 100}%`,
                  transform: `translate(${tx}, calc(-100% - 12px))`,
                }}
              >
                <div className="text-fg-3">Semana {primeraSemana + activo}</div>
                <div className="text-sm font-semibold text-fg">
                  {formatNumber(semanaActiva, decimales)} {unidad}
                </div>
                <div className={esBueno ? "text-ok-fg" : "text-risk-fg"}>
                  {formatSigned(diff!, decimales)} {unidad} frente a {metaEsLimite ? "el límite" : "la meta"}
                </div>
              </div>
            </>
          )}

          <div className="absolute inset-y-0 flex" style={{ left: hitInset, right: hitInset }}>
            {serie.map((_, i) => (
              <button
                key={i}
                type="button"
                tabIndex={-1}
                aria-hidden
                className="h-full flex-1 cursor-crosshair"
                onMouseEnter={() => setActivo(i)}
                onFocus={() => setActivo(i)}
              />
            ))}
          </div>
        </div>
        <div className="tabular flex justify-between text-[11px] text-fg-3">
          {xLabels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
