import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/db";
import * as schema from "@/db/schema";
import { obtenerOrganizacionPiloto } from "@/lib/organizacion-piloto";

function obtenerCorreosPermitidos(): string[] {
  return (process.env.CORREOS_PERMITIDOS ?? "")
    .split(",")
    .map((correo) => correo.trim().toLowerCase())
    .filter(Boolean);
}

function esCorreoPermitido(correo: string): boolean {
  return obtenerCorreosPermitidos().includes(correo.toLowerCase());
}

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), {
    provider: "pg",
    schema,
    usePlural: false,
  }),

  advanced: {
    database: {
      generateId: "uuid",
    },
  },

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
      // required:false a propósito: Better Auth valida los campos "required"
      // antes de ejecutar databaseHooks.user.create.before, que es donde se
      // rellena de verdad — con required:true nunca llega a ese hook.
      organizacionId: { type: "string", required: false, input: false },
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

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!esCorreoPermitido(user.email)) {
            throw new Error("Este correo no está autorizado para entrar al piloto.");
          }
          const organizacionId = await obtenerOrganizacionPiloto();
          return { data: { ...user, organizacionId } };
        },
      },
    },
  },

  // nextCookies() debe ir de último en la lista para poder poner las
  // cookies de sesión desde Server Actions.
  plugins: [nextCookies()],
});
