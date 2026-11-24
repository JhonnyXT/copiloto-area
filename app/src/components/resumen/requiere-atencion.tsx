import Link from "next/link";
import { ChevronRight, CircleAlert, CircleCheck, TriangleAlert } from "lucide-react";
import type { AvisoAtencion } from "@/lib/indicadores/atencion";
import { cn } from "@/lib/utils";

export function RequiereAtencion({ avisos }: { avisos: AvisoAtencion[] }) {
  return (
    <section aria-label="Requiere tu atención" className="rounded-xl border border-border bg-surface p-2">
      <h2 className="px-3 pb-1.5 pt-2.5 text-[15px] font-semibold tracking-[-0.005em]">Requiere tu atención</h2>
      {avisos.length === 0 ? (
        <p className="flex items-center gap-2.5 px-3 py-3 text-sm text-fg-2">
          <CircleCheck className="h-[18px] w-[18px] shrink-0 text-ok-fg" aria-hidden strokeWidth={1.75} />
          Todos tus indicadores están en meta.
        </p>
      ) : (
        <ul className="flex flex-col">
          {avisos.map((aviso) => (
            <li key={aviso.slug}>
              <FilaAviso aviso={aviso} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FilaAviso({ aviso }: { aviso: AvisoAtencion }) {
  const enRiesgo = aviso.estado === "risk";
  const Icono = enRiesgo ? TriangleAlert : CircleAlert;

  return (
    <Link href={`/indicadores/${aviso.slug}`} className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-surface-2">
      <Icono className={cn("mt-0.5 h-[18px] w-[18px] shrink-0 self-start", enRiesgo ? "text-risk-fg" : "text-warn-fg")} aria-hidden strokeWidth={1.75} />
      <span className="tabular flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium text-fg">{aviso.nombre}</span>
        <span className={cn("text-[13px] font-medium", enRiesgo ? "text-risk-fg" : "text-warn-fg")}>{aviso.desviacion}</span>
        <span className="text-[13px] text-fg-2">{aviso.detalle}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-fg-3 group-hover:text-fg" aria-hidden strokeWidth={1.75} />
    </Link>
  );
}
