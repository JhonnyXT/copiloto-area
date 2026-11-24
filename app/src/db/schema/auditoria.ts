import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organizaciones } from "./organizaciones";
import { usuarios } from "./usuarios";

export type AccionAuditoria =
  | "cargar_mediciones"
  | "generar_informe"
  | "exportar_informe"
  | "preguntar_documento"
  | "subir_documento";

export type DetalleAuditoria = Record<string, unknown>;

export const auditoria = pgTable("auditoria", {
  id: uuid().defaultRandom().primaryKey(),
  organizacionId: uuid("organizacion_id")
    .notNull()
    .references(() => organizaciones.id, { onDelete: "cascade" }),
  usuarioId: uuid("usuario_id").references(() => usuarios.id, { onDelete: "set null" }),
  accion: text().$type<AccionAuditoria>().notNull(),
  detalle: jsonb().$type<DetalleAuditoria>(),
  direccionIp: text("direccion_ip"),
  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
});

export type RegistroAuditoria = typeof auditoria.$inferSelect;
export type NuevoRegistroAuditoria = typeof auditoria.$inferInsert;
