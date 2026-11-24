import { AppShell } from "@/components/layout/app-shell";
import { StatusChip } from "@/components/ui/status-chip";
import { EditorInforme, BotonesInforme } from "@/components/informes/editor-informe";
import { formatDateTime } from "@/lib/utils";
import { informeSemanal } from "@/lib/demo-data";

export default function InformesPage() {
  return (
    <AppShell ruta={[{ label: "Operaciones" }, { label: "Informes", href: "/informes" }, { label: `Semana ${informeSemanal.semana}` }]}>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-5 p-4 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-[-0.015em] text-fg">Informe semanal · Semana {informeSemanal.semana}</h1>
              <StatusChip estado="warn">Borrador en revisión</StatusChip>
            </div>
            <p className="tabular text-sm text-fg-2">
              Generado {formatDateTime(informeSemanal.generadoEn)} con los datos cargados el 22 nov.
            </p>
          </div>
          <BotonesInforme />
        </div>

        <EditorInforme />
      </div>
    </AppShell>
  );
}
