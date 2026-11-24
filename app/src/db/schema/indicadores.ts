import { boolean, date, integer, numeric, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { organizaciones } from "./organizaciones";
import { usuarios } from "./usuarios";

/**
 * Indicadores · el catálogo de KPIs de un área (p. ej. "Producción de oro",
 * "Costo por onza"). Una fila por indicador, no por semana — los valores de
 * cada semana van en `mediciones`.
 */
export const indicadores = pgTable(
  "indicadores",
  {
    id: uuid().defaultRandom().primaryKey(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),

    /** Identificador corto y estable para URLs, p. ej. "costo-onza". Único por organización. */
    slug: text().notNull(),
    nombre: text().notNull(),
    unidad: text().notNull(), // "oz", "USD/oz", "%", "eventos"...

    /** 'mayor_mejor' (producción) o 'menor_mejor' (costo, accidentes). Decide el color del estado. */
    comparacion: text().notNull(),

    /** Orden de aparición en el tablero (menor primero). */
    orden: integer().notNull().default(0),

    /** Para poder archivar un indicador sin borrar su historial de mediciones. */
    activo: boolean().notNull().default(true),

    creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
  },
  (tabla) => [uniqueIndex("indicadores_org_slug_idx").on(tabla.organizacionId, tabla.slug)],
);

/**
 * Mediciones · un valor de un indicador en un periodo (normalmente una
 * semana). **Las cifras las calcula el sistema al cargar el Excel/CSV —
 * la IA nunca escribe ni modifica un valor aquí.** La meta se guarda por
 * periodo (no solo en `indicadores`) porque puede cambiar con el tiempo, y
 * así cada medición queda completa por sí sola para el gráfico y el informe.
 */
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

    /** De dónde salió la cifra — se muestra en "De dónde sale esta cifra" de la pantalla de detalle. */
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
