import { AppShell } from "@/components/layout/app-shell";
import { StatusChip } from "@/components/ui/status-chip";
import { EditorInforme, BotonesInforme } from "@/components/informes/editor-informe";
import { formatDateTime } from "@/lib/utils";
import { informeSemanal } from "@/lib/demo-data";

export default function InformesPage() {
  return (
    <AppShell
      titulo={`Informe semanal · Semana ${informeSemanal.semana}`}
      descripcion={`Generado el ${formatDateTime(informeSemanal.generadoEn)}`}
      estado={<StatusChip estado="warn">Borrador en revisión</StatusChip>}
      acciones={<BotonesInforme />}
    >
      <div className="p-4 md:p-5">
        <EditorInforme />
      </div>
    </AppShell>
  );
}
