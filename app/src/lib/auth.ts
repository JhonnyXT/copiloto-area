import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/db";
import * as schema from "@/db/schema";

/**
 * El piloto es de una sola organización ("Operaciones"). Esta función la
 * trae o la crea la primera vez que alguien entra — así `usuarios.organizacion_id`
 * (NOT NULL, pensado para cuando haya multiusuario) siempre tiene un valor
 * válido sin que Better Auth tenga que saber nada de organizaciones.
 */
async function obtenerOrganizacionPiloto(): Promise<string> {
  const db = getDb();
  const existente = await db.query.organizaciones.findFirst();
  if (existente) return existente.id;

  const [creada] = await db
    .insert(schema.organizaciones)
    .values({ nombre: "Operaciones (piloto)", esDatosDeEjemplo: true })
    .returning({ id: schema.organizaciones.id });
  return creada.id;
}

/**
 * Lista cerrada de correos permitidos — requisito no negociable del
 * proyecto (CONTEXTO.md §10): "registro cerrado, lista de correos
 * permitidos". No hay registro abierto; quien no esté aquí nunca entra,
 * así tenga una cuenta de Google válida.
 *
 * `CORREOS_PERMITIDOS` es una variable de entorno (lista separada por
 * comas) para poder agregar a alguien sin tocar código ni volver a
 * desplegar — solo la variable en Vercel.
 */
function correosPermitidos(): string[] {
  const lista = process.env.CORREOS_PERMITIDOS ?? "";
  return lista
    .split(",")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);
}

export const auth = betterAuth({
  // Nuestras tablas ya tienen los nombres (organizaciones, usuarios,
  // sesiones, cuentas_oauth, verificaciones) con `casing: "snake_case"` —
  // el adaptador solo necesita el esquema de Drizzle en sí.
  database: drizzleAdapter(getDb(), {
    provider: "pg",
    schema,
    usePlural: false,
  }),

  // El mapeo de cada modelo de Better Auth (user/session/account/verification)
  // a nuestra tabla y campos en español va aquí, no en el adaptador.
  user: {
    modelName: "usuarios",
    fields: {
      name: "nombre",
      email: "correo",
      emailVerified: "correoVerificado",
      image: "urlAvatar",
      createdAt: "creadoEn",
      updatedAt: "actualizadoEn",
    },
    additionalFields: {
      // NOT NULL en la base de datos; nunca lo manda el cliente (input:
      // false) — lo resuelve el hook de abajo con obtenerOrganizacionPiloto().
      organizacionId: { type: "string", required: true, input: false },
      rol: { type: "string", required: false, defaultValue: "lider_area" },
    },
  },
  session: {
    modelName: "sesiones",
    fields: {
      userId: "usuarioId",
      expiresAt: "expiraEn",
      ipAddress: "direccionIp",
      userAgent: "agenteUsuario",
      createdAt: "creadoEn",
      updatedAt: "actualizadoEn",
    },
    // Cookie firmada: la mayoría de llamadas a getSession() no golpean la
    // base de datos — recomendado para Vercel Fluid Compute.
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  account: {
    modelName: "cuentasOAuth",
    fields: {
      userId: "usuarioId",
      accountId: "idCuentaProveedor",
      providerId: "proveedor",
      accessToken: "tokenAcceso",
      refreshToken: "tokenRefresco",
      idToken: "tokenId",
      accessTokenExpiresAt: "tokenExpiraEn",
      refreshTokenExpiresAt: "tokenRefrescoExpiraEn",
      scope: "alcance",
      password: "clave",
      createdAt: "creadoEn",
      updatedAt: "actualizadoEn",
    },
  },
  verification: {
    modelName: "verificaciones",
    fields: {
      identifier: "identificador",
      value: "valor",
      expiresAt: "expiraEn",
      createdAt: "creadoEn",
      updatedAt: "actualizadoEn",
    },
  },

  // Solo Google. Nada de correo/contraseña: menos superficie de ataque y
  // coincide con la decisión ya tomada (CONTEXTO.md §10, "OAuth/OIDC vía
  // Better Auth, nada a mano").
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },

  // Registro cerrado: si el correo de Google no está en la lista permitida,
  // el login se rechaza aquí — antes de crear usuario o sesión.
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const permitidos = correosPermitidos();
          if (permitidos.length > 0 && !permitidos.includes(user.email.toLowerCase())) {
            throw new Error("Este correo no está autorizado para entrar al piloto.");
          }
          const organizacionId = await obtenerOrganizacionPiloto();
          return { data: { ...user, organizacionId } };
        },
      },
    },
  },

  plugins: [nextCookies()], // debe ir de último: pone las cookies desde Server Actions
});
