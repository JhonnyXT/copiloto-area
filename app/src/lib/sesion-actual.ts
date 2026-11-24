import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { esBypassDePruebasActivo } from "@/lib/e2e-bypass";
import { obtenerOrganizacionPiloto } from "@/lib/organizacion-piloto";

export async function obtenerOrganizacionIdActual(): Promise<string> {
  const sesion = await auth.api.getSession({ headers: await headers() });
  if (sesion) return sesion.user.organizacionId as string;

  if (esBypassDePruebasActivo()) return obtenerOrganizacionPiloto();

  throw new Error("No hay sesión activa.");
}
