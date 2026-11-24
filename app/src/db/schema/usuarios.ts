import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organizaciones } from "./organizaciones";

/**
 * Usuarios · acceso cerrado por lista de correos permitidos (sin registro abierto).
 * Esta misma tabla sirve como tabla de usuario de Better Auth (se mapea con
 * `usuarios` en la config de Better Auth — ver src/lib/auth.ts cuando se
 * construya el login). Un piloto solo tiene 1-2 filas aquí.
 */
export const usuarios = pgTable("usuarios", {
  id: uuid().defaultRandom().primaryKey(),
  organizacionId: uuid("organizacion_id")
    .notNull()
    .references(() => organizaciones.id, { onDelete: "cascade" }),

  correo: text().notNull().unique(),
  nombre: text().notNull(),
  correoVerificado: boolean("correo_verificado").notNull().default(false),
  urlAvatar: text("url_avatar"),

  /** 'lider_area' (Carlos) o 'administrador' (Jonathan, soporte). */
  rol: text().notNull().default("lider_area"),

  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Sesiones de login (tabla "session" de Better Auth, en español).
 */
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
});

/**
 * Cuentas de login externas (tabla "account" de Better Auth) — por ahora solo Google.
 * Los tokens de Google nunca llegan al navegador (patrón BFF): quedan aquí,
 * cifrados en reposo por Neon, y el backend los usa solo del lado del servidor.
 */
export const cuentasOAuth = pgTable("cuentas_oauth", {
  id: uuid().defaultRandom().primaryKey(),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),

  proveedor: text().notNull().default("google"),
  idCuentaProveedor: text("id_cuenta_proveedor").notNull(),
  tokenAcceso: text("token_acceso"),
  tokenRefresco: text("token_refresco"),
  tokenExpiraEn: timestamp("token_expira_en", { withTimezone: true }),

  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
});

export type Usuario = typeof usuarios.$inferSelect;
export type NuevoUsuario = typeof usuarios.$inferInsert;
