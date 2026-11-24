import { index, integer, pgTable, text, timestamp, uuid, vector } from "drizzle-orm/pg-core";
import { organizaciones } from "./organizaciones";
import { usuarios } from "./usuarios";

// Debe coincidir con la dimensión del modelo de embeddings vigente al construir
// el buscador (hoy: text-embedding-004 de Gemini, 768). Un cambio de modelo
// requiere una migración nueva, no solo editar este número.
const DIMENSION_EMBEDDING = 768;

export const documentos = pgTable("documentos", {
  id: uuid().defaultRandom().primaryKey(),
  organizacionId: uuid("organizacion_id")
    .notNull()
    .references(() => organizaciones.id, { onDelete: "cascade" }),

  titulo: text().notNull(),
  codigo: text(),
  totalPaginas: integer("total_paginas").notNull(),
  rutaArchivo: text("ruta_archivo").notNull(),
  tamanoBytes: integer("tamano_bytes"),
  subidoPorId: uuid("subido_por_id").references(() => usuarios.id, { onDelete: "set null" }),
  subidoEn: timestamp("subido_en", { withTimezone: true }).notNull().defaultNow(),
});

export const fragmentosDocumento = pgTable(
  "fragmentos_documento",
  {
    id: uuid().defaultRandom().primaryKey(),
    documentoId: uuid("documento_id")
      .notNull()
      .references(() => documentos.id, { onDelete: "cascade" }),

    pagina: integer().notNull(),
    orden: integer().notNull().default(0),
    contenido: text().notNull(),
    embedding: vector({ dimensions: DIMENSION_EMBEDDING }),
    creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
  },
  (tabla) => [index("fragmentos_documento_embedding_idx").using("hnsw", tabla.embedding.op("vector_cosine_ops"))],
);

export type Documento = typeof documentos.$inferSelect;
export type NuevoDocumento = typeof documentos.$inferInsert;
export type FragmentoDocumento = typeof fragmentosDocumento.$inferSelect;
export type NuevoFragmentoDocumento = typeof fragmentosDocumento.$inferInsert;
