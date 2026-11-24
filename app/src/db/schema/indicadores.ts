import { boolean, date, integer, numeric, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { organizaciones } from "./organizaciones";
import { usuarios } from "./usuarios";

export type ComparacionIndicador = "mayor_mejor" | "menor_mejor";

export const indicadores = pgTable(
  "indicadores",
  {
    id: uuid().defaultRandom().primaryKey(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),

    slug: text().notNull(),
    nombre: text().notNull(),
    unidad: text().notNull(),
    comparacion: text().$type<ComparacionIndicador>().notNull(),
    orden: integer().notNull().default(0),
    activo: boolean().notNull().default(true),

    creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
  },
  (tabla) => [uniqueIndex("indicadores_org_slug_idx").on(tabla.organizacionId, tabla.slug)],
);

export const mediciones = pgTable(
  "mediciones",
  {
    id: uuid().defaultRandom().primaryKey(),
    indicadorId: uuid("indicador_id")
      .notNull()
      .references(() => indicadores.id, { onDelete: "cascade" }),

    periodoInicio: date("periodo_inicio").notNull(),
    periodoFin: date("periodo_fin").notNull(),
    valor: numeric({ precision: 14, scale: 4 }).notNull(),
    meta: numeric({ precision: 14, scale: 4 }).notNull(),
    archivoOrigen: text("archivo_origen"),
    hojaOrigen: text("hoja_origen"),
    cargadoPorId: uuid("cargado_por_id").references(() => usuarios.id, { onDelete: "set null" }),
    cargadoEn: timestamp("cargado_en", { withTimezone: true }).notNull().defaultNow(),
  },
  (tabla) => [uniqueIndex("mediciones_indicador_periodo_idx").on(tabla.indicadorId, tabla.periodoInicio)],
);

export type Indicador = typeof indicadores.$inferSelect;
export type NuevoIndicador = typeof indicadores.$inferInsert;
export type Medicion = typeof mediciones.$inferSelect;
export type NuevaMedicion = typeof mediciones.$inferInsert;
