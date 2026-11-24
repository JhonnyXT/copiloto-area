import type { ComparacionIndicador } from "@/db/schema";
import { formatNumber, formatSigned } from "@/lib/utils";
import type { Estado } from "./tipos";

const TOLERANCIA_ANTES_DE_RIESGO = 0.05;

export function calcularEstado(valorActual: number, meta: number, comparacion: ComparacionIndicador): Estado {
  const cumpleMeta = comparacion === "mayor_mejor" ? valorActual >= meta : valorActual <= meta;
  if (cumpleMeta) return "ok";
  if (meta === 0) return "risk";

  const desviacion = Math.abs(valorActual - meta) / meta;
  return desviacion <= TOLERANCIA_ANTES_DE_RIESGO ? "warn" : "risk";
}

export function calcularCaption(
  valorActual: number,
  meta: number,
  comparacion: ComparacionIndicador,
  unidad: string,
  decimales: number,
): string {
  const prefijoMeta = comparacion === "menor_mejor" && meta !== 0 ? "Meta ≤ " : "Meta ";
  const textoMeta = `${prefijoMeta}${formatNumber(meta, decimales)} ${unidad}`;
  if (meta === 0) return textoMeta;
  return `${textoMeta} · ${formatSigned(((valorActual - meta) / meta) * 100, 1, " %")}`;
}

export function calcularSubtituloTendencia(serie: number[], unidad: string, decimales: number): string {
  if (serie.length < 2) return "Primera semana con datos.";
  const actual = serie.at(-1)!;
  const anterior = serie.at(-2)!;
  const delta = actual - anterior;
  if (delta === 0) return "Igual que la semana anterior.";
  const direccion = delta > 0 ? "Subió" : "Bajó";
  const unidadDelCambio = unidad.startsWith("%") ? "puntos" : unidad;
  return `${direccion} ${formatNumber(Math.abs(delta), decimales)} ${unidadDelCambio} en la semana.`;
}
