import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organizaciones } from "./organizaciones";
import { usuarios } from "./usuarios";

/**
 * Auditoría · registro de quién hizo qué. Requisito de seguridad del
 * proyecto (CONTEXTO.md §10): toda carga de datos, generación de informe,
 * exportación y pregunta al buscador queda registrada, sin guardar más
 * información de la necesaria. Solo se escribe, nunca se edita ni se borra
 * desde la aplicación.
 */
export const auditoria = pgTable("auditoria", {
  id: uuid().defaultRandom().primaryKey(),
  organizacionId: uuid("organizacion_id")
    .notNull()
    .references(() => organizaciones.id, { onDelete: "cascade" }),
  usuarioId: uuid("usuario_id").references(() => usuarios.id, { onDelete: "set null" }),

  /** 'cargar_mediciones' | 'generar_informe' | 'exportar_informe' | 'preguntar_documento' | 'subir_documento' | ... */
  accion: text().notNull(),

  /** Detalle propio de cada acción, p. ej. { "indicadorId": "...", "filas": 12 }. */
  detalle: jsonb(),

  direccionIp: text("direccion_ip"),
  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
});

export type RegistroAuditoria = typeof auditoria.$inferSelect;
export type NuevoRegistroAuditoria = typeof auditoria.$inferInsert;
