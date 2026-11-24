import { FileText, Gauge, LayoutDashboard, MessageCircleQuestion } from "lucide-react";

export const SECCIONES = [
  { href: "/", label: "Resumen", icono: LayoutDashboard, prefijo: "/" },
  { href: "/indicadores/costo-onza", label: "Indicadores", icono: Gauge, prefijo: "/indicadores" },
  { href: "/informes", label: "Informes", icono: FileText, prefijo: "/informes" },
  { href: "/documentos", label: "Documentos", icono: MessageCircleQuestion, prefijo: "/documentos" },
];

export function esSeccionActiva(prefijo: string, pathname: string): boolean {
  return prefijo === "/" ? pathname === "/" : pathname.startsWith(prefijo);
}
