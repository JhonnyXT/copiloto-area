import type { ComparacionIndicador } from "@/db/schema";
import { crearGeneradorDeterministico, numeroEntre, redondear } from "./rng";

export interface CatalogoIndicador {
  slug: string;
  nombre: string;
  unidad: string;
  comparacion: ComparacionIndicador;
  orden: number;
  decimales: number;
  metaBase: number;
  archivoOrigen: string;
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
    archivoOrigen: "indicadores_ejemplo.xlsx",
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
    archivoOrigen: "indicadores_ejemplo.xlsx",
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
    archivoOrigen: "seguridad_ejemplo.xlsx",
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
    archivoOrigen: "mantenimiento_ejemplo.xlsx",
    hojaOrigen: "Órdenes",
  },
];

export interface SemanaGenerada {
  indice: number;
  periodoInicio: Date;
  periodoFin: Date;
  valor: number;
  meta: number;
}

function lunesDeEstaSemana(fecha: Date): Date {
  const copia = new Date(fecha);
  const diaIso = (copia.getDay() + 6) % 7;
  copia.setDate(copia.getDate() - diaIso);
  copia.setHours(0, 0, 0, 0);
  return copia;
}

export function generarCalendarioSemanal(totalSemanas: number, fechaFin: Date): { inicio: Date; fin: Date }[] {
  const ultimoLunes = lunesDeEstaSemana(fechaFin);
  const semanas: { inicio: Date; fin: Date }[] = [];
  for (let i = totalSemanas - 1; i >= 0; i--) {
    const inicio = new Date(ultimoLunes);
    inicio.setDate(inicio.getDate() - i * 7);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 6);
    semanas.push({ inicio, fin });
  }
  return semanas;
}

function generarSerieEnergia(totalSemanas: number, semilla: number): number[] {
  const azar = crearGeneradorDeterministico(semilla);
  const serie: number[] = [];
  let tarifa = 0.12;
  for (let i = 0; i < totalSemanas; i++) {
    tarifa += numeroEntre(azar, -0.002, 0.004);
    tarifa = Math.max(0.1, Math.min(0.18, tarifa));
    serie.push(tarifa);
  }
  return serie;
}

export function generarMediciones(
  catalogo: CatalogoIndicador,
  calendario: { inicio: Date; fin: Date }[],
  semilla: number,
): SemanaGenerada[] {
  const azar = crearGeneradorDeterministico(semilla);
  const totalSemanas = calendario.length;
  const serieEnergia = generarSerieEnergia(totalSemanas, semilla * 7 + 1);

  const valores: number[] = [];
  let produccionBase = catalogo.metaBase * 0.96;
  let mantenimientoBase = 94;

  for (let i = 0; i < totalSemanas; i++) {
    let valor: number;
    switch (catalogo.slug) {
      case "produccion": {
        produccionBase += numeroEntre(azar, -15, 20);
        produccionBase = Math.max(catalogo.metaBase * 0.75, Math.min(catalogo.metaBase * 1.15, produccionBase));
        valor = produccionBase + numeroEntre(azar, -10, 10);
        break;
      }
      case "costo-onza": {
        const desviacionEnergia = (serieEnergia[i] - 0.14) * 2200;
        valor = catalogo.metaBase + desviacionEnergia + numeroEntre(azar, -20, 20);
        break;
      }
      case "seguridad": {
        valor = azar() < 0.07 ? 1 : 0;
        break;
      }
      case "mantenimiento": {
        mantenimientoBase += numeroEntre(azar, -3, 2.2);
        mantenimientoBase = Math.max(82, Math.min(98, mantenimientoBase));
        valor = mantenimientoBase;
        break;
      }
      default:
        valor = catalogo.metaBase;
    }
    valores.push(redondear(valor, catalogo.decimales));
  }

  return calendario.map(({ inicio, fin }, i) => ({
    indice: i,
    periodoInicio: inicio,
    periodoFin: fin,
    valor: valores[i],
    meta: catalogo.metaBase,
  }));
}
