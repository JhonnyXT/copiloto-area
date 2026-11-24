import { writeFileSync } from "node:fs";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { indicadores, mediciones, documentos, fragmentosDocumento } from "@/db/schema";
import { obtenerOrganizacionPiloto } from "@/lib/organizacion-piloto";
import { CATALOGO_INDICADORES, generarCalendarioSemanal, generarMediciones } from "./lib/generar-indicadores";
import { generarDocumentosFicticios } from "./lib/generar-documentos";

const SEMILLA = 20261124;
const TOTAL_SEMANAS = 60;

async function sembrarIndicadores(organizacionId: string) {
  const db = getDb();
  const calendario = generarCalendarioSemanal(TOTAL_SEMANAS, new Date());

  for (const catalogo of CATALOGO_INDICADORES) {
    const [indicador] = await db
      .insert(indicadores)
      .values({
        organizacionId,
        slug: catalogo.slug,
        nombre: catalogo.nombre,
        unidad: catalogo.unidad,
        comparacion: catalogo.comparacion,
        orden: catalogo.orden,
      })
      .onConflictDoUpdate({
        target: [indicadores.organizacionId, indicadores.slug],
        set: { nombre: catalogo.nombre, unidad: catalogo.unidad, comparacion: catalogo.comparacion, orden: catalogo.orden },
      })
      .returning();

    await db.delete(mediciones).where(eq(mediciones.indicadorId, indicador.id));

    const semanas = generarMediciones(catalogo, calendario, SEMILLA + catalogo.orden);
    await db.insert(mediciones).values(
      semanas.map((semana) => ({
        indicadorId: indicador.id,
        periodoInicio: semana.periodoInicio.toISOString().slice(0, 10),
        periodoFin: semana.periodoFin.toISOString().slice(0, 10),
        valor: String(semana.valor),
        meta: String(semana.meta),
        archivoOrigen: catalogo.archivoOrigen,
        hojaOrigen: catalogo.hojaOrigen,
      })),
    );

    console.log(`  · ${catalogo.nombre}: ${semanas.length} semanas`);
  }
}

async function sembrarDocumentos(organizacionId: string) {
  const db = getDb();
  const documentosExistentes = await db.query.documentos.findMany({ where: eq(documentos.organizacionId, organizacionId) });
  for (const doc of documentosExistentes) {
    await db.delete(documentos).where(eq(documentos.id, doc.id));
  }

  const { documentos: generados, preguntasEvaluacion } = generarDocumentosFicticios(SEMILLA);

  for (const generado of generados) {
    const [documento] = await db
      .insert(documentos)
      .values({
        organizacionId,
        titulo: generado.titulo,
        codigo: generado.codigo,
        totalPaginas: generado.totalPaginas,
        rutaArchivo: `documentos-ejemplo/${generado.codigo}.pdf`,
      })
      .returning();

    await db.insert(fragmentosDocumento).values(
      generado.paginas.map((pagina) => ({
        documentoId: documento.id,
        pagina: pagina.pagina,
        contenido: pagina.contenido,
      })),
    );
  }

  const totalPaginas = generados.reduce((suma, d) => suma + d.totalPaginas, 0);
  console.log(`  · ${generados.length} documentos, ${totalPaginas} páginas en total`);
  console.log("  · embedding de cada fragmento: pendiente (Fase 3, requiere GEMINI_API_KEY)");

  return preguntasEvaluacion;
}

function escribirPreguntasEvaluacion(preguntas: ReturnType<typeof generarDocumentosFicticios>["preguntasEvaluacion"]) {
  const lineas = [
    "# Preguntas de evaluación del buscador (datos ficticios)",
    "",
    "Generadas junto con los datos de ejemplo — ver `scripts/sembrar-datos-ficticios.ts`.",
    "Cuando el buscador real (Fase 3) esté conectado, cada una debe responder citando el",
    "documento y la página indicados, sin inventar nada.",
    "",
    ...preguntas.map(
      (p, i) =>
        `${i + 1}. **${p.pregunta}**\n   - Documento: ${p.documentoTitulo}, página ${p.pagina}\n   - Respuesta esperada: ${p.respuestaEsperada}`,
    ),
    "",
  ];
  writeFileSync("../docs/preguntas-buscador-evaluacion.md", lineas.join("\n"));
}

async function main() {
  console.log("Sembrando datos ficticios del piloto…");
  const organizacionId = await obtenerOrganizacionPiloto();
  console.log(`Organización: ${organizacionId}`);

  console.log("Indicadores y mediciones:");
  await sembrarIndicadores(organizacionId);

  console.log("Documentos:");
  const preguntasEvaluacion = await sembrarDocumentos(organizacionId);
  escribirPreguntasEvaluacion(preguntasEvaluacion);
  console.log(`  · docs/preguntas-buscador-evaluacion.md escrito (${preguntasEvaluacion.length} preguntas)`);

  console.log("Listo.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
