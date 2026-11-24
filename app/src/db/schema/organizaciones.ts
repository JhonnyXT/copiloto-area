import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Organizaciones · el "org_id" de todo el esquema.
 *
 * El piloto tiene una sola fila aquí (el área de Carlos), pero el esquema
 * está listo desde el día 1 para que entren más organizaciones si el
 * producto se revende a otros líderes de área — ver docs/plan-tecnico.md.
 * Toda tabla con datos de un cliente apunta a `organizaciones.id`.
 */
export const organizaciones = pgTable("organizaciones", {
  id: uuid().defaultRandom().primaryKey(),

  /** Nombre visible, p. ej. "Operaciones (piloto)". Nunca el nombre real de una empresa real aquí. */
  nombre: text().notNull(),

  /** La franja "Datos de ejemplo" se muestra mientras esto sea true. En el piloto siempre es true. */
  esDatosDeEjemplo: boolean("es_datos_de_ejemplo").notNull().default(true),

  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
});

export type Organizacion = typeof organizaciones.$inferSelect;
export type NuevaOrganizacion = typeof organizaciones.$inferInsert;
