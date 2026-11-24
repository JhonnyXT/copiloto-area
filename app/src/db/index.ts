import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Conexión perezosa: Next.js evalúa este módulo durante `next build`, antes
// de que Vercel tenga las variables de entorno — conectar aquí arriba
// rompería el primer despliegue.
let dbInstance: ReturnType<typeof crearDb> | null = null;

function crearDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql, { schema, casing: "snake_case" });
}

export function getDb() {
  if (!dbInstance) dbInstance = crearDb();
  return dbInstance;
}
