import type { ComparacionIndicador } from "@/db/schema";
import { numeroSemanaIso } from "@/lib/semanas";
import { crearGeneradorDeterministico, numeroEntre, redondear } from "./rng";

export interface CatalogoIndicador {
  slug: string;
  nombre: string;
  unidad: string;
  comparacion: ComparacionIndicador;
  orden: number;
  decimales: number;
  metaBase: number;
  prefijoArchivo: string;
  hojaOrigen: string;
}

export const CATALOGO_INDICADORES: readonly CatalogoIndicador[] = [
  {
    slug: "produccion",
    nombre: "Producción de oro",
    unidad: "oz",
    comparacion: "mayor_mejor",
    orden: 1,
    decimales: 0,
    metaBase: 1250,
    prefijoArchivo: "indicadores",
    hojaOrigen: "Producción",
  },
  {
    slug: "costo-onza",
    nombre: "Costo por onza",
    unidad: "USD/oz",
    comparacion: "menor_mejor",
    orden: 2,
    decimales: 0,
    metaBase: 1100,
    prefijoArchivo: "indicadores",
    hojaOrigen: "Costos",
  },
  {
    slug: "seguridad",
    nombre: "Accidentes incapacitantes",
    unidad: "eventos",
    comparacion: "menor_mejor",
    orden: 3,
    decimales: 0,
    metaBase: 0,
    prefijoArchivo: "seguridad",
    hojaOrigen: "Eventos",
  },
  {
    slug: "mantenimiento",
    nombre: "Mantenimiento preventivo",
    unidad: "% cumplido",
    comparacion: "mayor_mejor",
    orden: 4,
    decimales: 0,
    metaBase: 95,
    prefijoArchivo: "mantenimiento",
    hojaOrigen: "Órdenes",
  },
];

export interface SemanaCalendario {
  inicio: string;
  fin: string;
}

export interface MedicionGenerada {
  periodoInicio: string;
  periodoFin: string;
  valor: number;
  meta: number;
  archivoOrigen: string;
}

const DIAS_POR_SEMANA = 7;
const TARIFA_ENERGIA_CENTRAL = 0.14;
const COSTO_POR_PUNTO_DE_TARIFA = 2200;

// Coinciden con las cifras fijas del informe y del desglose de costo (demo-data.ts): cambiar unas obliga a cambiar las otras.
const CIERRE_POR_INDICADOR: Record<string, readonly number[]> = {
  produccion: [1180, 1215, 1190, 1240, 1260, 1225, 1275, 1300, 1242, 1290, 1310, 1284],
  "costo-onza": [1068, 1075, 1060, 1082, 1090, 1071, 1085, 1098, 1104, 1092, 1100, 1142],
  mantenimiento: [96, 94, 93, 95, 97, 94, 92, 95, 93, 90, 91, 88],
};
const SEMANAS_CON_ACCIDENTE = new Set(["2025-12-08", "2026-03-16", "2026-06-29"]);

function sumarDias(fechaIso: string, dias: number): string {
  const fecha = new Date(`${fechaIso}T00:00:00Z`);
  fecha.setUTCDate(fecha.getUTCDate() + dias);
  return fecha.toISOString().slice(0, 10);
}

export function generarCalendarioSemanal(totalSemanas: number, ultimoLunes: string): SemanaCalendario[] {
  return Array.from({ length: totalSemanas }, (_, i) => {
    const inicio = sumarDias(ultimoLunes, (i - totalSemanas + 1) * DIAS_POR_SEMANA);
    return { inicio, fin: sumarDias(inicio, DIAS_POR_SEMANA - 1) };
  });
}

function generarOscilacion(azar: () => number, total: number, centro: number, amplitud: number): number[] {
  let desvio = 0;
  return Array.from({ length: total }, () => {
    desvio = desvio * 0.7 + numeroEntre(azar, -amplitud, amplitud);
    return centro + desvio;
  });
}

function generarHistoria(slug: string, calendario: SemanaCalendario[], azar: () => number): number[] {
  const total = calendario.length;
  switch (slug) {
    case "produccion":
      return generarOscilacion(azar, total, 1215, 30);
    case "costo-onza": {
      const tarifas = generarOscilacion(azar, total, TARIFA_ENERGIA_CENTRAL, 0.01);
      return tarifas.map((tarifa) => 1090 + (tarifa - TARIFA_ENERGIA_CENTRAL) * COSTO_POR_PUNTO_DE_TARIFA + numeroEntre(azar, -8, 8));
    }
    case "mantenimiento":
      return generarOscilacion(azar, total, 94.5, 1.6).map((valor) => Math.min(100, valor));
    case "seguridad":
      return calendario.map(({ inicio }) => (SEMANAS_CON_ACCIDENTE.has(inicio) ? 1 : 0));
    default:
      throw new Error(`No hay generador para el indicador "${slug}".`);
  }
}

export function generarMediciones(
  catalogo: CatalogoIndicador,
  calendario: SemanaCalendario[],
  semilla: number,
): MedicionGenerada[] {
  const cierre = CIERRE_POR_INDICADOR[catalogo.slug] ?? [];
  const semanasDeHistoria = calendario.slice(0, calendario.length - cierre.length);
  const historia = generarHistoria(catalogo.slug, semanasDeHistoria, crearGeneradorDeterministico(semilla));
  const valores = [...historia, ...cierre];

  return calendario.map(({ inicio, fin }, i) => ({
    periodoInicio: inicio,
    periodoFin: fin,
    valor: redondear(valores[i], catalogo.decimales),
    meta: catalogo.metaBase,
    archivoOrigen: `${catalogo.prefijoArchivo}_s${numeroSemanaIso(inicio)}_ejemplo.xlsx`,
  }));
}
