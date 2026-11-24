import Link from "next/link";
import { FileText } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { IndicadoresConTendencia } from "@/components/resumen/indicadores-con-tendencia";
import { OtrasAreas } from "@/components/resumen/otras-areas";
import { RequiereAtencion } from "@/components/resumen/requiere-atencion";
import { obtenerAvisos } from "@/lib/indicadores/atencion";
import { obtenerKpisDeOrganizacion } from "@/lib/indicadores/indicadores-repositorio";
import { formatearPeriodo, numeroSemanaIso } from "@/lib/semanas";
import { obtenerOrganizacionIdActual } from "@/lib/sesion-actual";

export const instant = false;

export default async function ResumenPage() {
  const kpis = await obtenerKpisDeOrganizacion(await obtenerOrganizacionIdActual());
  if (kpis.length === 0) return <ResumenSinDatos />;

  const { inicio, fin } = kpis[0].periodo;

  return (
    <AppShell
      titulo="Resumen de la semana"
      descripcion={`Semana ${numeroSemanaIso(inicio)} · del ${formatearPeriodo(inicio, fin)}`}
      acciones={
        <Link
          href="/informes"
          className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-on-primary hover:bg-primary-hover max-md:h-11"
        >
          <FileText className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.75} />
          Ver informe semanal
        </Link>
      }
    >
      <div className="grid min-h-full gap-4 p-4 md:p-5 lg:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <IndicadoresConTendencia kpis={kpis} />
        <aside className="flex flex-col gap-4">
          <RequiereAtencion avisos={obtenerAvisos(kpis)} />
          <OtrasAreas />
        </aside>
      </div>
    </AppShell>
  );
}

function ResumenSinDatos() {
  return (
    <AppShell titulo="Resumen de la semana" descripcion="Todavía no hay semanas cerradas con datos.">
      <p className="p-6 text-sm text-fg-2">Cuando se cargue la primera semana de indicadores, la verás aquí.</p>
    </AppShell>
  );
}
