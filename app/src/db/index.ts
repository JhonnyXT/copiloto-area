import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Cliente de base de datos, con inicialización perezosa: `neon()` lanza un
 * error si DATABASE_URL no existe, y Next.js evalúa el código de arriba del
 * módulo también durante `next build` — si se llama a `neon()` al importar
 * este archivo, el build se cae en el primer despliegue (antes de que Vercel
 * tenga las variables). `getDb()` solo se conecta cuando de verdad se usa.
 */
let _db: ReturnType<typeof crearDb> | null = null;

function crearDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql, { schema, casing: "snake_case" });
}

export function getDb() {
  if (!_db) _db = crearDb();
  return _db;
}
