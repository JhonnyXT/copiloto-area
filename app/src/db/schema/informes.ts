import { date, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organizaciones } from "./organizaciones";
import { usuarios } from "./usuarios";

/**
 * Informes · el informe semanal en 1 clic. `contenidoHtml` es lo que el
 * usuario ve y edita; dentro lleva marcadores ya resueltos a la cifra real
 * (la IA redactó el texto alrededor, nunca escribió el número). `cifras`
 * guarda qué valores se insertaron y de qué medición salió cada uno, para
 * poder mostrar "13 de 13 cifras verificadas" y volver a comprobarlas.
 */
export const informes = pgTable("informes", {
  id: uuid().defaultRandom().primaryKey(),
  organizacionId: uuid("organizacion_id")
    .notNull()
    .references(() => organizaciones.id, { onDelete: "cascade" }),

  periodoInicio: date("periodo_inicio").notNull(),
  periodoFin: date("periodo_fin").notNull(),

  contenidoHtml: text("contenido_html").notNull(),

  /** Qué secciones están activas, p. ej. {"resumen":true,"costos":true,"otrasAreas":false}. */
  secciones: jsonb().notNull().default({}),

  /**
   * Las cifras insertadas y su procedencia, p. ej.
   * [{ "marcador": "costo_por_onza", "medicionId": "...", "valor": "1142" }, ...]
   * — de aquí sale el contador de "cifras verificadas" del panel de revisión.
   */
  cifras: jsonb().notNull().default([]),

  /** 'borrador' → 'revisado' → 'exportado'. */
  estado: text().notNull().default("borrador"),

  generadoPorId: uuid("generado_por_id").references(() => usuarios.id, { onDelete: "set null" }),
  generadoEn: timestamp("generado_en", { withTimezone: true }).notNull().defaultNow(),
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(),
});

export type Informe = typeof informes.$inferSelect;
export type NuevoInforme = typeof informes.$inferInsert;
