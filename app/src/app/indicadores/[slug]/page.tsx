import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { TrendChart } from "@/components/ui/trend-chart";
import { formatDate, formatNumber } from "@/lib/utils";
import { costoDesglose, kpis } from "@/lib/demo-data";

export function generateStaticParams() {
  return kpis.map((k) => ({ slug: k.slug }));
}

function mensajeEstado(valor: number, meta: number, estado: string, unidad: string) {
  const diff = valor - meta;
  const signo = diff > 0 ? "+" : "";
  if (estado === "cumple") return `${signo}${formatNumber(Math.abs(((valor - meta) / meta) * 100), 1)} % sobre meta`;
  if (estado === "atencion") return `${formatNumber(Math.abs(diff), 0)} pts bajo meta`;
  return `${signo}${formatNumber(((valor - meta) / meta) * 100, 1)} % sobre meta`;
}

export default async function IndicadorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kpi = kpis.find((k) => k.slug === slug);
  if (!kpi) notFound();

  const semanaAnterior = kpi.serie.at(-2) ?? kpi.valor;
  const totalCosto = costoDesglose.reduce((s, c) => s + c.valor, 0);

  return (
    <AppShell>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-col gap-3">
          <nav aria-label="Ruta" className="flex gap-2 text-[13px] text-subtle-foreground">
            <Link href="/indicadores/costo-onza" className="hover:text-foreground">
              Indicadores
            </Link>
            <span aria-hidden>/</span>
            <span>{kpi.nombre}</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[28px] font-semibold tracking-[-0.01em] text-foreground">{kpi.nombre}</h1>
                <StatusBadge estado={kpi.estado}>
                  {mensajeEstado(kpi.valor, kpi.meta, kpi.estado, kpi.unidad)}
                </StatusBadge>
              </div>
              <div className="tabular flex flex-wrap items-baseline gap-2">
                <span className="text-[40px] font-bold leading-none text-foreground">
                  {formatNumber(kpi.valor, kpi.unidad === "%" ? 0 : kpi.valor % 1 ? 1 : 0)}
                </span>
                <span className="text-base font-medium text-muted-foreground">{kpi.unidad}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  Meta {kpi.comparacion === "menor-mejor" ? "≤ " : ""}
                  {formatNumber(kpi.meta)} · Semana anterior {formatNumber(semanaAnterior, semanaAnterior % 1 ? 1 : 0)}
                </span>
              </div>
            </div>
            <div role="group" aria-label="Periodo" className="flex gap-1 rounded-[10px] bg-muted p-1">
              <button type="button" className="h-9 rounded-lg px-3.5 text-[13px] font-medium text-muted-foreground">
                12 semanas
              </button>
              <button
                type="button"
                aria-pressed="true"
                className="shadow-hover h-9 rounded-lg bg-card px-3.5 text-[13px] font-semibold text-foreground"
              >
                26 semanas
              </button>
              <button type="button" className="h-9 rounded-lg px-3.5 text-[13px] font-medium text-muted-foreground">
                Año
              </button>
            </div>
          </div>
        </div>

        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-card-foreground">Tendencia de 12 semanas</h2>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-[3px] w-3 rounded-full bg-primary" /> {kpi.nombre}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0 w-3 border-t-2 border-dashed border-subtle-foreground" /> Meta {formatNumber(kpi.meta)}
              </span>
            </div>
          </div>
          <TrendChart serie={kpi.serie} meta={kpi.meta} unidad={kpi.unidad} />
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {kpi.slug === "costo-onza" && (
            <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold text-card-foreground">De qué está hecho el costo</h2>
                <p className="text-[13px] text-muted-foreground">USD por onza, semana 47, y cambio frente a la semana anterior</p>
              </div>
              <div className="tabular flex flex-col gap-3.5 text-sm">
                {costoDesglose.map((c) => (
                  <div key={c.nombre} className="flex flex-col gap-1.5">
                    <div className="flex justify-between gap-3">
                      <span className="font-medium text-foreground">{c.nombre}</span>
                      <span>
                        <strong className="text-foreground">{c.valor}</strong>{" "}
                        <span className={c.tendencia === "sube" ? "text-danger" : "text-success"}>
                          {c.tendencia === "sube" ? "▲" : "▼"} {formatNumber(Math.abs(c.variacion), 1)} %
                        </span>
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${(c.valor / costoDesglose[0].valor) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-between border-t border-border pt-3 font-semibold text-foreground">
                  <span>Total</span>
                  <span>
                    {formatNumber(totalCosto)} {kpi.unidad}
                  </span>
                </div>
              </div>
            </section>
          )}

          <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
              <h2 className="text-base font-semibold text-card-foreground">Con qué se relaciona</h2>
              <ul className="tabular flex flex-col gap-3.5 text-sm leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong>Tarifa de energía</strong> (Servicios) subió 6,0 %. Explica la mayor parte del aumento.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong>Disponibilidad de equipos</strong> (Mantenimiento) bajó a 91 %: más correctivos, menos
                    preventivo.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-subtle-foreground" />
                  <span>
                    <strong>Producción</strong> de 1.284 oz: más onzas reparten mejor el costo fijo.
                  </span>
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
              <h2 className="text-base font-semibold text-card-foreground">De dónde sale esta cifra</h2>
              <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Cálculo</dt>
                <dd>Costo total del área ÷ onzas producidas</dd>
                <dt className="text-muted-foreground">Archivo</dt>
                <dd className="truncate">
                  <span className="text-primary">{kpi.fuente.archivo}</span> · hoja {kpi.fuente.hoja}
                </dd>
                <dt className="text-muted-foreground">Cargado</dt>
                <dd className="tabular">{formatDate(kpi.fuente.cargado)}, por Carlos</dd>
              </dl>
              <p className="flex items-center gap-2 text-[13px] font-medium text-success">
                <Check className="h-4 w-4" aria-hidden strokeWidth={2.5} />
                Calculado por el sistema con reglas fijas, no por la IA
              </p>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
