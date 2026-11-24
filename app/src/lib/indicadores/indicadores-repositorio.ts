import { asc, desc, lt } from "drizzle-orm";
import { getDb } from "@/db";
import { indicadores } from "@/db/schema";
import { fechaDeHoy, numeroSemanaIso } from "@/lib/semanas";
import { calcularCaption, calcularEstado, calcularSubtituloTendencia } from "./calculo-indicadores";
import { obtenerEditorial } from "./catalogo-editorial";
import type { Kpi } from "./tipos";

const SEMANAS_DETALLE = 26;
const SEMANAS_RESUMEN = 12;

export async function obtenerKpisDeOrganizacion(organizacionId: string): Promise<Kpi[]> {
  const hoy = fechaDeHoy();

  const filas = await getDb().query.indicadores.findMany({
    where: (tabla, { eq }) => eq(tabla.organizacionId, organizacionId),
    orderBy: [asc(indicadores.orden)],
    with: {
      mediciones: {
        where: (tabla) => lt(tabla.periodoFin, hoy),
        orderBy: (tabla) => [desc(tabla.periodoInicio)],
        limit: SEMANAS_DETALLE,
      },
    },
  });

  return filas
    .filter((fila) => fila.mediciones.length > 0)
    .map((fila) => {
      const mediciones = [...fila.mediciones].reverse();
      const serieCompleta = mediciones.map((medicion) => ({
        semana: numeroSemanaIso(medicion.periodoInicio),
        valor: Number(medicion.valor),
      }));

      const ultima = mediciones.at(-1)!;
      const valorActual = Number(ultima.valor);
      const meta = Number(ultima.meta);
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
        periodo: { inicio: ultima.periodoInicio, fin: ultima.periodoFin },
        serie: serieCompleta.slice(-SEMANAS_RESUMEN),
        serie26: serieCompleta.length > SEMANAS_RESUMEN ? serieCompleta : undefined,
        tendencia: {
          titulo: editorial.tendenciaTitulo,
          subtitulo: calcularSubtituloTendencia(
            serieCompleta.map((punto) => punto.valor),
            fila.unidad,
            editorial.decimales,
          ),
          leyenda: editorial.tendenciaLeyenda,
        },
        fuente: {
          archivo: ultima.archivoOrigen ?? "",
          hoja: ultima.hojaOrigen ?? "",
          cargado: ultima.cargadoEn.toISOString(),
        },
      } satisfies Kpi;
    });
}
