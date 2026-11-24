import type { ComparacionIndicador } from "@/db/schema";
import type { Estado } from "@/lib/demo-data";
import { formatNumber, formatSigned } from "@/lib/utils";

const comparacionEsMejorMayor = (comparacion: ComparacionIndicador) => comparacion === "mayor_mejor";

export function calcularEstado(valorActual: number, meta: number, comparacion: ComparacionIndicador): Estado {
  const cumplimiento = meta === 0 ? (valorActual === 0 ? 1 : 0) : valorActual / meta;
  const favorable = comparacionEsMejorMayor(comparacion) ? cumplimiento >= 1 : cumplimiento <= 1;
  if (favorable) return "ok";

  const desviacion = Math.abs(cumplimiento - 1);
  return desviacion <= 0.05 ? "warn" : "risk";
}

export function calcularCaption(
  valorActual: number,
  meta: number,
  comparacion: ComparacionIndicador,
  unidad: string,
  decimales: number,
): string {
  const prefijoMeta = comparacion === "menor_mejor" ? "Meta ≤ " : "Meta ";
  const variacionPct = meta === 0 ? 0 : ((valorActual - meta) / meta) * 100;
  return `${prefijoMeta}${formatNumber(meta, decimales)} ${unidad} · ${formatSigned(variacionPct, 1, " %")}`;
}

export function calcularSubtituloTendencia(serie: number[], unidad: string, decimales: number): string {
  if (serie.length < 2) return "Primera semana con datos.";
  const actual = serie.at(-1)!;
  const anterior = serie.at(-2)!;
  const delta = actual - anterior;
  if (delta === 0) return "Se mantuvo igual que la semana anterior.";
  const direccion = delta > 0 ? "Subió" : "Bajó";
  return `${direccion} ${formatNumber(Math.abs(delta), decimales)} ${unidad} frente a la semana anterior.`;
}
