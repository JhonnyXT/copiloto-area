import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organizaciones } from "./organizaciones";

/**
 * Usuarios · acceso cerrado por lista de correos permitidos (sin registro
 * abierto). Esta tabla es también la tabla de usuario de Better Auth —
 * mapeada en `src/lib/auth.ts` con nombres de campo en español. Un piloto
 * solo tiene 1-2 filas aquí.
 */
export const usuarios = pgTable("usuarios", {
  id: uuid().defaultRandom().primaryKey(),
  organizacionId: uuid("organizacion_id")
    .notNull()
    .references(() => organizaciones.id, { onDelete: "cascade" }),

  correo: text().notNull().unique(), // Better Auth: email
  nombre: text().notNull(), // Better Auth: name
  correoVerificado: boolean("correo_verificado").notNull().default(false), // Better Auth: emailVerified
  urlAvatar: text("url_avatar"), // Better Auth: image

  /** 'lider_area' (Carlos) o 'administrador' (Jonathan, soporte). */
  rol: text().notNull().default("lider_area"),

  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(), // createdAt
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(), // updatedAt
});

/**
 * Sesiones de login (tabla "session" de Better Auth, en español). Los
 * nombres de campo de Better Auth están anotados en cada columna.
 */
export const sesiones = pgTable("sesiones", {
  id: uuid().defaultRandom().primaryKey(),
  usuarioId: uuid("usuario_id") // userId
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),

  token: text().notNull().unique(), // token
  expiraEn: timestamp("expira_en", { withTimezone: true }).notNull(), // expiresAt
  direccionIp: text("direccion_ip"), // ipAddress
  agenteUsuario: text("agente_usuario"), // userAgent

  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(), // createdAt
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(), // updatedAt
});

/**
 * Cuentas de login externas (tabla "account" de Better Auth) — por ahora
 * solo Google. Los tokens de Google nunca llegan al navegador (patrón BFF):
 * quedan aquí, cifrados en reposo por Neon, y el backend los usa solo del
 * lado del servidor.
 */
export const cuentasOAuth = pgTable("cuentas_oauth", {
  id: uuid().defaultRandom().primaryKey(),
  usuarioId: uuid("usuario_id") // userId
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),

  idCuentaProveedor: text("id_cuenta_proveedor").notNull(), // accountId
  proveedor: text().notNull().default("google"), // providerId
  tokenAcceso: text("token_acceso"), // accessToken
  tokenRefresco: text("token_refresco"), // refreshToken
  tokenId: text("token_id"), // idToken
  tokenExpiraEn: timestamp("token_expira_en", { withTimezone: true }), // accessTokenExpiresAt
  tokenRefrescoExpiraEn: timestamp("token_refresco_expira_en", { withTimezone: true }), // refreshTokenExpiresAt
  alcance: text(), // scope
  clave: text(), // password — no se usa (solo Google), Better Auth igual declara el campo

  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(), // createdAt
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(), // updatedAt
});

/**
 * Verificaciones (tabla "verification" de Better Auth): tokens de un solo
 * uso que la librería necesita internamente (p. ej. al validar el estado
 * del login con Google), aunque el piloto no use verificación por correo.
 */
export const verificaciones = pgTable("verificaciones", {
  id: uuid().defaultRandom().primaryKey(),
  identificador: text().notNull(), // identifier
  valor: text().notNull(), // value
  expiraEn: timestamp("expira_en", { withTimezone: true }).notNull(), // expiresAt

  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(), // createdAt
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(), // updatedAt
});

export type Usuario = typeof usuarios.$inferSelect;
export type NuevoUsuario = typeof usuarios.$inferInsert;
