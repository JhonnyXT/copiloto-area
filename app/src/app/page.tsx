import Link from "next/link";
import { ChevronLeft, ChevronRight, FileText, Info, SquareCheck, TrendingDown, TrendingUp, TriangleAlert, UploadCloud } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusChip } from "@/components/ui/status-chip";
import { IndicadoresConTendencia } from "@/components/resumen/indicadores-con-tendencia";
import { area, feed, indicadoresOtrasAreas } from "@/lib/demo-data";

const iconoFeed = { ok: SquareCheck, warn: TriangleAlert, risk: TriangleAlert, info: Info };
const colorFeed = {
  ok: "bg-ok-soft text-ok-fg",
  warn: "bg-warn-soft text-warn-fg",
  risk: "bg-risk-soft text-risk-fg",
  info: "bg-info-soft text-info-fg",
};

export default function ResumenPage() {
  return (
    <AppShell ruta={[{ label: "Operaciones" }, { label: "Resumen" }]}>
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 p-4 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-[-0.015em] text-fg">Resumen de la semana</h1>
            <p className="tabular text-sm text-fg-2">Semana {area.semana} · del {area.periodo}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-0.5">
              <button type="button" aria-label="Semana anterior" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong bg-surface text-fg hover:bg-surface-2">
                <ChevronLeft className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.75} />
              </button>
              <span className="tabular min-w-[92px] text-center text-sm font-medium">Semana {area.semana}</span>
              <button type="button" aria-label="Semana siguiente" disabled className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong bg-surface text-fg opacity-45">
                <ChevronRight className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.75} />
              </button>
            </div>
            <Link href="/informes" className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-on-primary hover:bg-primary-hover">
              <FileText className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.75} />
              Generar informe semanal
            </Link>
          </div>
        </div>

        <p className="-mt-2 flex flex-wrap items-center gap-2 text-sm text-fg-2">
          <span>Esta semana:</span>
          <StatusChip estado="ok">2 en meta</StatusChip>
          <StatusChip estado="warn">1 requiere atención</StatusChip>
          <StatusChip estado="risk">1 en riesgo</StatusChip>
        </p>

        <IndicadoresConTendencia />

        <section aria-label="Requiere tu atención" className="rounded-xl border border-border bg-surface p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold tracking-[-0.005em]">Requiere tu atención</h2>
            <span className="tabular text-xs text-fg-3">{feed.length} novedades</span>
          </div>
          <ul className="flex flex-col gap-4">
            {feed.map((item) => {
              const Icon = iconoFeed[item.tipo];
              const contenido = (
                <div className="flex gap-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${colorFeed[item.tipo]}`}>
                    <Icon className="h-3.5 w-3.5" aria-hidden strokeWidth={2.25} />
                  </span>
                  <div className="flex flex-col gap-1 text-sm leading-relaxed">
                    <span className="tabular font-semibold">{item.titulo}</span>
                    <span className="tabular text-[13px] text-fg-2">{item.detalle}</span>
                    {item.link && (
                      <span className="mt-0.5 flex items-center gap-1 text-[13px] font-medium text-primary">
                        {item.accion}
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    )}
                  </div>
                </div>
              );
              return <li key={item.titulo}>{item.link ? <Link href={item.link}>{contenido}</Link> : contenido}</li>;
            })}
          </ul>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex flex-wrap items-end justify-between gap-4 p-6 pb-3.5">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[15px] font-semibold tracking-[-0.005em]">Indicadores de otras áreas</h2>
              <p className="text-[13px] text-fg-2">De los reportes que te llegan por correo, relacionados con los de tu área</p>
            </div>
            <Link href="/documentos?cargar=1" className="flex h-8 items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-3 text-[13px] font-medium hover:bg-surface-2">
              <UploadCloud className="h-4 w-4" aria-hidden strokeWidth={1.75} />
              Cargar reporte
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="tabular w-full min-w-[820px] border-collapse text-sm">
              <thead className="bg-surface-2">
                <tr>
                  <th scope="col" className="px-6 py-2.5 text-left text-xs font-medium text-fg-3">Indicador</th>
                  <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-fg-3">Área</th>
                  <th scope="col" className="px-4 py-2.5 text-right text-xs font-medium text-fg-3">Valor</th>
                  <th scope="col" className="px-4 py-2.5 text-right text-xs font-medium text-fg-3">vs. semana anterior</th>
                  <th scope="col" className="px-6 py-2.5 text-left text-xs font-medium text-fg-3">Relación con tu área</th>
                  <th scope="col" className="px-6 py-2.5 text-left text-xs font-medium text-fg-3">Recibido</th>
                </tr>
              </thead>
              <tbody>
                {indicadoresOtrasAreas.map((row) => {
                  const Flecha = row.arriba ? TrendingUp : TrendingDown;
                  return (
                    <tr key={row.nombre} className="border-t border-border hover:bg-surface-2">
                      <td className="px-6 py-3 font-medium text-fg">{row.nombre}</td>
                      <td className="px-4 py-3 text-fg-2">{row.area}</td>
                      <td className="px-4 py-3 text-right text-fg">{row.valor}</td>
                      <td className={`px-4 py-3 text-right font-medium ${row.bueno ? "text-ok-fg" : "text-risk-fg"}`}>
                        <span className="inline-flex items-center gap-1">
                          <Flecha className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
                          {row.delta}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-fg-2">{row.relacion}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-fg-3">{row.recibido}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
