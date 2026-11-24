import Link from "next/link";
import { Calendar, Check, FileText, Info, TriangleAlert } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { TrendChart } from "@/components/ui/trend-chart";
import { formatDate } from "@/lib/utils";
import { area, indicadoresOtrasAreas, kpis, loQueCambio } from "@/lib/demo-data";

const produccion = kpis.find((k) => k.slug === "produccion")!;

const iconoCambio = { cumple: Check, atencion: TriangleAlert, riesgo: TriangleAlert, info: Info };
const colorCambio = {
  cumple: "bg-success-soft text-success-soft-foreground",
  atencion: "bg-warning-soft text-warning-soft-foreground",
  riesgo: "bg-danger-soft text-danger-soft-foreground",
  info: "bg-primary-soft text-primary-soft-foreground",
};

export default function InicioPage() {
  return (
    <AppShell>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[28px] font-semibold tracking-[-0.01em] text-foreground">
              Hola, {area.usuario}
            </h1>
            <p className="text-sm text-muted-foreground">
              Semana {area.semana} · {area.periodo} · Última carga de datos: {formatDate(area.ultimaCarga)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-lg border border-input bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Calendar className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.8} />
              Semana {area.semana}
            </button>
            <Link
              href="/informes"
              className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <FileText className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.8} />
              Generar informe semanal
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.slug} kpi={kpi} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 xl:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold text-card-foreground">
                  Producción de tu área frente a la meta
                </h2>
                <p className="text-[13px] text-muted-foreground">
                  Esta semana tu área aportó el <strong className="font-semibold text-foreground">41 %</strong>{" "}
                  de la producción de la compañía (1.284 de 3.130 oz)
                </p>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-[3px] w-3 rounded-full bg-primary" /> Tu área
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-0 w-3 border-t-2 border-dashed border-subtle-foreground" /> Meta
                </span>
              </div>
            </div>
            <TrendChart serie={produccion.serie} meta={produccion.meta} unidad={produccion.unidad} />
          </section>

          <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground">Lo que cambió esta semana</h2>
            <ul className="flex flex-col gap-4">
              {loQueCambio.map((item) => {
                const Icon = iconoCambio[item.tipo];
                const content = (
                  <div className="flex gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] ${colorCambio[item.tipo]}`}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden strokeWidth={2.5} />
                    </span>
                    <div className="flex flex-col gap-1 text-sm leading-relaxed text-foreground">
                      <span className="tabular">{item.texto}</span>
                      {item.link && (
                        <span className="text-[13px] font-medium text-primary group-hover:underline">
                          Ver detalle
                        </span>
                      )}
                    </div>
                  </div>
                );
                return (
                  <li key={item.texto}>
                    {item.link ? (
                      <Link href={item.link} className="group block">
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <section className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold text-card-foreground">Indicadores de otras áreas</h2>
              <p className="text-[13px] text-muted-foreground">
                Tomados de los reportes que te llegan, amarrados a los tuyos
              </p>
            </div>
            <Link href="/documentos?cargar=1" className="text-sm font-medium text-primary hover:underline">
              Cargar reporte nuevo
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="bg-muted/60">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-subtle-foreground">
                    Indicador
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-subtle-foreground">
                    Área
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-subtle-foreground">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-subtle-foreground">
                    vs. semana anterior
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-subtle-foreground">
                    Relación con tu área
                  </th>
                </tr>
              </thead>
              <tbody className="tabular">
                {indicadoresOtrasAreas.map((row) => (
                  <tr key={row.nombre} className="border-t border-border hover:bg-muted/50">
                    <td className="px-6 py-3 font-medium text-foreground">{row.nombre}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.area}</td>
                    <td className="px-4 py-3 text-right text-foreground">{row.valor}</td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        row.variacion >= 0 ? "text-danger" : "text-success"
                      }`}
                    >
                      {row.variacion >= 0 ? "▲" : "▼"} {Math.abs(row.variacion)}
                      {row.nombre.includes("Tarifa") || row.nombre.includes("Producción") ? " %" : ""}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{row.relacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
