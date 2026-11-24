import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organizaciones } from "./organizaciones";

export type RolUsuario = "lider_area" | "administrador";

export const usuarios = pgTable("usuarios", {
  id: uuid().defaultRandom().primaryKey(),
  organizacionId: uuid("organizacion_id")
    .notNull()
    .references(() => organizaciones.id, { onDelete: "cascade" }),

  correo: text().notNull().unique(),
  nombre: text().notNull(),
  correoVerificado: boolean("correo_verificado").notNull().default(false),
  urlAvatar: text("url_avatar"),
  rol: text().$type<RolUsuario>().notNull().default("lider_area"),

  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(),
});

export const sesiones = pgTable("sesiones", {
  id: uuid().defaultRandom().primaryKey(),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),

  token: text().notNull().unique(),
  expiraEn: timestamp("expira_en", { withTimezone: true }).notNull(),
  direccionIp: text("direccion_ip"),
  agenteUsuario: text("agente_usuario"),

  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(),
});

export const cuentasOAuth = pgTable("cuentas_oauth", {
  id: uuid().defaultRandom().primaryKey(),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),

  idCuentaProveedor: text("id_cuenta_proveedor").notNull(),
  proveedor: text().notNull().default("google"),
  tokenAcceso: text("token_acceso"),
  tokenRefresco: text("token_refresco"),
  tokenId: text("token_id"),
  tokenExpiraEn: timestamp("token_expira_en", { withTimezone: true }),
  tokenRefrescoExpiraEn: timestamp("token_refresco_expira_en", { withTimezone: true }),
  alcance: text(),
  clave: text(),

  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(),
});

export const verificaciones = pgTable("verificaciones", {
  id: uuid().defaultRandom().primaryKey(),
  identificador: text().notNull(),
  valor: text().notNull(),
  expiraEn: timestamp("expira_en", { withTimezone: true }).notNull(),

  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(),
});

export type Usuario = typeof usuarios.$inferSelect;
export type NuevoUsuario = typeof usuarios.$inferInsert;
