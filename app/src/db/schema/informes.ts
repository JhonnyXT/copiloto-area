import { date, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organizaciones } from "./organizaciones";
import { usuarios } from "./usuarios";

export type SeccionesActivasInforme = Record<string, boolean>;

export interface CifraVerificadaInforme {
  marcador: string;
  medicionId: string;
  valor: string;
}

export type EstadoInforme = "borrador" | "revisado" | "exportado";

export const informes = pgTable("informes", {
  id: uuid().defaultRandom().primaryKey(),
  organizacionId: uuid("organizacion_id")
    .notNull()
    .references(() => organizaciones.id, { onDelete: "cascade" }),

  periodoInicio: date("periodo_inicio").notNull(),
  periodoFin: date("periodo_fin").notNull(),
  contenidoHtml: text("contenido_html").notNull(),
  secciones: jsonb().$type<SeccionesActivasInforme>().notNull().default({}),
  cifras: jsonb().$type<CifraVerificadaInforme[]>().notNull().default([]),
  estado: text().$type<EstadoInforme>().notNull().default("borrador"),
  generadoPorId: uuid("generado_por_id").references(() => usuarios.id, { onDelete: "set null" }),
  generadoEn: timestamp("generado_en", { withTimezone: true }).notNull().defaultNow(),
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(),
});

export type Informe = typeof informes.$inferSelect;
export type NuevoInforme = typeof informes.$inferInsert;
