import { getDb } from "@/db";
import { organizaciones } from "@/db/schema";

export async function obtenerOrganizacionPiloto(): Promise<string> {
  const db = getDb();
  const organizacionExistente = await db.query.organizaciones.findFirst();
  if (organizacionExistente) return organizacionExistente.id;

  const [organizacionCreada] = await db
    .insert(organizaciones)
    .values({ nombre: "Operaciones (piloto)", esDatosDeEjemplo: true })
    .returning({ id: organizaciones.id });
  return organizacionCreada.id;
}
