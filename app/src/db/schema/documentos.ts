import { index, integer, pgTable, text, timestamp, uuid, vector } from "drizzle-orm/pg-core";
import { organizaciones } from "./organizaciones";
import { usuarios } from "./usuarios";

/**
 * ⚠️ Dimensión del vector: 768, la de `text-embedding-004` de Gemini (modelo
 * gratuito del piloto). **Confirmar el nombre y la dimensión del modelo
 * vigente al momento de construir el buscador** (regla del proyecto: los
 * modelos de IA cambian seguido) — si cambia, esta columna y sus índices
 * necesitan una migración nueva, no solo cambiar el número aquí.
 */
const DIMENSION_EMBEDDING = 768;

/**
 * Documentos · los PDF que el usuario sube para el buscador (procedimientos,
 * instructivos...). El archivo en sí vive en Vercel Blob; aquí solo queda la
 * referencia y los metadatos para mostrar la cita (documento + página).
 */
export const documentos = pgTable("documentos", {
  id: uuid().defaultRandom().primaryKey(),
  organizacionId: uuid("organizacion_id")
    .notNull()
    .references(() => organizaciones.id, { onDelete: "cascade" }),

  titulo: text().notNull(), // "Procedimiento de ventilación (ejemplo)"
  codigo: text(), // "PR-VEN-014", si el documento tiene uno
  totalPaginas: integer("total_paginas").notNull(),

  /** Ruta del archivo en Vercel Blob (store privado). */
  rutaArchivo: text("ruta_archivo").notNull(),
  tamanoBytes: integer("tamano_bytes"),

  subidoPorId: uuid("subido_por_id").references(() => usuarios.id, { onDelete: "set null" }),
  subidoEn: timestamp("subido_en", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Fragmentos de documento · cada documento se parte en trozos de ~1 página
 * (o menos) para la búsqueda. `embedding` es el vector de significado de ese
 * trozo; `contenido` es el texto tal cual, para mostrarlo citado y resaltado
 * en el visor. La respuesta del buscador **siempre** señala de qué fragmento
 * salió (documento + página) o dice que no encontró nada — nunca inventa.
 */
export const fragmentosDocumento = pgTable(
  "fragmentos_documento",
  {
    id: uuid().defaultRandom().primaryKey(),
    documentoId: uuid("documento_id")
      .notNull()
      .references(() => documentos.id, { onDelete: "cascade" }),

    pagina: integer().notNull(),
    orden: integer().notNull().default(0), // por si una página se parte en varios fragmentos
    contenido: text().notNull(),
    embedding: vector({ dimensions: DIMENSION_EMBEDDING }),

    creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
  },
  (tabla) => [
    // Búsqueda por significado (coseno) — ver scripts/migrar-indice-vectorial.sql
    // para el índice HNSW, que drizzle-kit no genera automáticamente para pgvector.
    index("fragmentos_documento_embedding_idx").using(
      "hnsw",
      tabla.embedding.op("vector_cosine_ops"),
    ),
  ],
);

export type Documento = typeof documentos.$inferSelect;
export type NuevoDocumento = typeof documentos.$inferInsert;
export type FragmentoDocumento = typeof fragmentosDocumento.$inferSelect;
export type NuevoFragmentoDocumento = typeof fragmentosDocumento.$inferInsert;
