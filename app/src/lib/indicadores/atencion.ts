import { formatNumber } from "@/lib/utils";
import type { Estado, Kpi } from "./tipos";

export interface AvisoAtencion {
  slug: string;
  estado: Estado;
  nombre: string;
  desviacion: string;
  detalle: string;
}

const PRIORIDAD: Record<Estado, number> = { risk: 0, warn: 1, ok: 2 };

function describirDesviacion({ valorActual, meta, unidad, decimales }: Kpi): string {
  if (meta === 0) return `${formatNumber(valorActual, decimales)} ${unidad}, la meta es 0`;
  const porcentaje = (Math.abs(valorActual - meta) / meta) * 100;
  return `${formatNumber(porcentaje, 1)} % ${valorActual > meta ? "sobre" : "bajo"} la meta`;
}

export function obtenerAvisos(kpis: Kpi[]): AvisoAtencion[] {
  return kpis
    .filter((kpi) => kpi.estado !== "ok")
    .sort((a, b) => PRIORIDAD[a.estado] - PRIORIDAD[b.estado])
    .map((kpi) => ({
      slug: kpi.slug,
      estado: kpi.estado,
      nombre: kpi.nombre,
      desviacion: describirDesviacion(kpi),
      detalle: kpi.tendencia.subtitulo,
    }));
}
