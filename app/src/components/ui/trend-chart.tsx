"use client";

import * as React from "react";
import { calcularEscala } from "@/lib/escala-grafico";
import type { PuntoSerie } from "@/lib/indicadores/tipos";
import { cn, formatNumber, formatSigned } from "@/lib/utils";

const ANCHO = 600;
const ALTO = 200;
const MAXIMO_ETIQUETAS = 6;

interface TrendChartProps {
  serie: PuntoSerie[];
  meta: number;
  unidad: string;
  decimales: number;
  mayorEsMejor: boolean;
  className?: string;
}

function indicesConEtiqueta(total: number): Set<number> {
  const salto = Math.max(1, Math.ceil((total - 1) / (MAXIMO_ETIQUETAS - 1)));
  const indices = new Set<number>();
  for (let i = total - 1; i >= 0; i -= salto) indices.add(i);
  return indices;
}

function desplazamientoEnBordes(indice: number, total: number): string {
  if (indice === 0) return "0%";
  return indice === total - 1 ? "-100%" : "-50%";
}

export function TrendChart({ serie, meta, unidad, decimales, mayorEsMejor, className }: TrendChartProps) {
  const total = serie.length;
  const gradienteId = React.useId();
  const [activo, setActivo] = React.useState<number | null>(null);

  const escala = React.useMemo(
    () => calcularEscala([...serie.map((punto) => punto.valor), meta], decimales),
    [serie, meta, decimales],
  );
  const etiquetados = React.useMemo(() => indicesConEtiqueta(total), [total]);

  const pctX = (indice: number) => (total > 1 ? (indice / (total - 1)) * 100 : 100);
  const pctY = (valor: number) => (1 - (valor - escala.min) / (escala.max - escala.min)) * 100;
  const coordX = (indice: number) => ((pctX(indice) / 100) * ANCHO).toFixed(1);
  const coordY = (valor: number) => ((pctY(valor) / 100) * ALTO).toFixed(1);

  const linea = serie.map((punto, i) => `${i === 0 ? "M" : "L"}${coordX(i)},${coordY(punto.valor)}`).join(" ");
  const ultimo = serie[total - 1];

  return (
    <div className={cn("grid min-h-[200px] grid-cols-[auto_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto] gap-x-3 gap-y-2.5 pt-2", className)}>
      <div aria-hidden className="tabular relative text-xs text-fg-3">
        <span className="invisible">{formatNumber(escala.max, decimales)}</span>
        {escala.marcas.map((marca) => (
          <span key={marca} className="absolute right-0 -translate-y-1/2" style={{ top: `${pctY(marca)}%` }}>
            {formatNumber(marca, decimales)}
          </span>
        ))}
      </div>

      <div className="relative" onMouseLeave={() => setActivo(null)}>
        <svg
          role="img"
          aria-label={`Tendencia de ${total} semanas, de la ${serie[0].semana} a la ${ultimo.semana}. Valor actual ${formatNumber(ultimo.valor, decimales)} ${unidad}; meta ${formatNumber(meta, decimales)}.`}
          viewBox={`0 0 ${ANCHO} ${ALTO}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id={gradienteId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--primary)" stopOpacity="0.14" />
              <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {escala.marcas.map((marca) => (
            <line key={marca} x1={0} x2={ANCHO} y1={coordY(marca)} y2={coordY(marca)} stroke="var(--grid)" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={`${linea} L${ANCHO},${ALTO} L0,${ALTO} Z`} fill={`url(#${gradienteId})`} />
          <path d={`M0 ${coordY(meta)}H${ANCHO}`} stroke="var(--target)" strokeWidth={1.5} strokeDasharray="5 4" fill="none" vectorEffect="non-scaling-stroke" />
          <path d={linea} stroke="var(--primary)" strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>

        <span
          aria-hidden
          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-surface"
          style={{ left: `${pctX(total - 1)}%`, top: `${pctY(ultimo.valor)}%` }}
        />

        {activo !== null && (
          <DetalleSemana
            punto={serie[activo]}
            meta={meta}
            unidad={unidad}
            decimales={decimales}
            mayorEsMejor={mayorEsMejor}
            izquierda={pctX(activo)}
            arriba={pctY(serie[activo].valor)}
            desplazamiento={desplazamientoEnBordes(activo, total)}
          />
        )}

        <div aria-hidden className="absolute inset-y-0 flex" style={{ left: `${-50 / (total - 1 || 1)}%`, right: `${-50 / (total - 1 || 1)}%` }}>
          {serie.map((punto, i) => (
            <span key={punto.semana} className="h-full flex-1 cursor-crosshair" onMouseEnter={() => setActivo(i)} />
          ))}
        </div>
      </div>

      <div aria-hidden className="tabular relative col-start-2 h-4 text-xs text-fg-3">
        {serie.map(
          (punto, i) =>
            etiquetados.has(i) && (
              <span
                key={punto.semana}
                className="absolute whitespace-nowrap"
                style={{ left: `${pctX(i)}%`, transform: `translateX(${desplazamientoEnBordes(i, total)})` }}
              >
                Sem {punto.semana}
              </span>
            ),
        )}
      </div>
    </div>
  );
}

interface DetalleSemanaProps {
  punto: PuntoSerie;
  meta: number;
  unidad: string;
  decimales: number;
  mayorEsMejor: boolean;
  izquierda: number;
  arriba: number;
  desplazamiento: string;
}

function DetalleSemana({ punto, meta, unidad, decimales, mayorEsMejor, izquierda, arriba, desplazamiento }: DetalleSemanaProps) {
  const diferencia = punto.valor - meta;
  const cumple = mayorEsMejor ? diferencia >= 0 : diferencia <= 0;
  const cabeArriba = arriba > 45;

  return (
    <>
      <span aria-hidden className="absolute inset-y-0 w-px bg-border-strong" style={{ left: `${izquierda}%` }} />
      <span
        aria-hidden
        className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-[3px] ring-surface"
        style={{ left: `${izquierda}%`, top: `${arriba}%` }}
      />
      <div
        className="tabular shadow-pop pointer-events-none absolute z-10 whitespace-nowrap rounded-lg border border-border bg-surface px-3 py-2 text-xs leading-relaxed"
        style={{
          left: `${izquierda}%`,
          top: `${arriba}%`,
          transform: `translate(${desplazamiento}, ${cabeArriba ? "calc(-100% - 12px)" : "12px"})`,
        }}
      >
        <div className="text-fg-3">Semana {punto.semana}</div>
        <div className="text-sm font-semibold text-fg">
          {formatNumber(punto.valor, decimales)} {unidad}
        </div>
        <div className={cumple ? "text-ok-fg" : "text-risk-fg"}>
          {formatSigned(diferencia, decimales)} {unidad} frente a la meta
        </div>
      </div>
    </>
  );
}
