import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const organizaciones = pgTable("organizaciones", {
  id: uuid().defaultRandom().primaryKey(),
  nombre: text().notNull(),
  esDatosDeEjemplo: boolean("es_datos_de_ejemplo").notNull().default(true),
  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
});

export type Organizacion = typeof organizaciones.$inferSelect;
export type NuevaOrganizacion = typeof organizaciones.$inferInsert;
