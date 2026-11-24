import { asc, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { indicadores } from "@/db/schema";
import type { Kpi } from "@/lib/demo-data";
import { obtenerEditorial } from "./catalogo-editorial";
import { calcularCaption, calcularEstado, calcularSubtituloTendencia } from "./calculo-indicadores";

const SEMANAS_DETALLE = 26;
const SEMANAS_RESUMEN = 12;

export async function obtenerKpisDeOrganizacion(organizacionId: string): Promise<Kpi[]> {
  const db = getDb();

  const filas = await db.query.indicadores.findMany({
    where: (tabla, { eq }) => eq(tabla.organizacionId, organizacionId),
    orderBy: [asc(indicadores.orden)],
    with: {
      mediciones: {
        orderBy: (tabla) => [desc(tabla.periodoInicio)],
        limit: SEMANAS_DETALLE,
      },
    },
  });

  return filas
    .filter((fila) => fila.mediciones.length > 0)
    .map((fila) => {
      const medicionesOrdenadas = [...fila.mediciones].reverse();
      const serieCompleta = medicionesOrdenadas.map((m) => Number(m.valor));
      const serie26 = serieCompleta.length > SEMANAS_RESUMEN ? serieCompleta : undefined;
      const serie = serieCompleta.slice(-SEMANAS_RESUMEN);

      const ultimaMedicion = medicionesOrdenadas.at(-1)!;
      const valorActual = Number(ultimaMedicion.valor);
      const meta = Number(ultimaMedicion.meta);
      const editorial = obtenerEditorial(fila.slug);

      return {
        slug: fila.slug,
        nombre: fila.nombre,
        descripcion: editorial.descripcion,
        unidad: fila.unidad,
        decimales: editorial.decimales,
        meta,
        comparacion: fila.comparacion === "mayor_mejor" ? "mayor-mejor" : "menor-mejor",
        estado: calcularEstado(valorActual, meta, fila.comparacion),
        valorActual,
        caption: calcularCaption(valorActual, meta, fila.comparacion, fila.unidad, editorial.decimales),
        serie,
        serie26,
        tendencia: {
          titulo: editorial.tendenciaTitulo,
          subtitulo: calcularSubtituloTendencia(serieCompleta, fila.unidad, editorial.decimales),
          leyenda: editorial.tendenciaLeyenda,
        },
        fuente: {
          archivo: ultimaMedicion.archivoOrigen ?? "",
          hoja: ultimaMedicion.hojaOrigen ?? "",
          cargado: ultimaMedicion.cargadoEn.toISOString(),
        },
      } satisfies Kpi;
    });
}

export function obtenerMetaEsLimitePorSlug(kpis: Kpi[]): Record<string, boolean> {
  return Object.fromEntries(kpis.map((kpi) => [kpi.slug, obtenerEditorial(kpi.slug).esLimite]));
}
