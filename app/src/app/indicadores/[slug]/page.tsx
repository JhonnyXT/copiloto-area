import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, MessageCircleQuestion, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusChip } from "@/components/ui/status-chip";
import { IndicadorTendenciaPeriodo } from "@/components/indicador/tendencia-periodo";
import { formatDate, formatNumber, formatSigned } from "@/lib/utils";
import { costoDesglose, kpis, metaEsLimite } from "@/lib/demo-data";

export function generateStaticParams() {
  return kpis.map((k) => ({ slug: k.slug }));
}

export default async function IndicadorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kpi = kpis.find((k) => k.slug === slug);
  if (!kpi) notFound();

  const esLimite = metaEsLimite[kpi.slug];
  const decimales = kpi.slug === "seguridad" ? 1 : 0;
  const semanaAnterior = kpi.serie.at(-2) ?? kpi.valorActual;
  const diferenciaMeta = kpi.valorActual - kpi.meta;
  const promedio = kpi.serie.reduce((s, v) => s + v, 0) / kpi.serie.length;
  const semanasSobreMeta = kpi.serie.filter((v) => (kpi.comparacion === "mayor-mejor" ? v >= kpi.meta : v <= kpi.meta)).length;
  const totalCosto = costoDesglose.partes.reduce((s, p) => s + p.valor, 0);
  const maxExplicacion = Math.max(...costoDesglose.explicacion.map((e) => Math.abs(e.puntos)));

  return (
    <AppShell
      ruta={[
        { label: "Operaciones" },
        { label: "Indicadores", href: "/indicadores/costo-onza" },
        { label: kpi.nombre },
      ]}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 p-4 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-[-0.015em] text-fg">{kpi.nombre}</h1>
              <StatusChip estado={kpi.estado} />
            </div>
            <p className="text-sm text-fg-2">{kpi.descripcion}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/documentos" className="flex h-9 items-center gap-2 rounded-lg border border-border-strong bg-surface px-3.5 text-sm font-medium hover:bg-surface-2">
              <MessageCircleQuestion className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.75} />
              Preguntar sobre este indicador
            </Link>
            <Link href="/informes" className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-on-primary hover:bg-primary-hover">
              <Plus className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.75} />
              Agregar al informe
            </Link>
          </div>
        </div>

        <section aria-label="Cifras clave" className="overflow-hidden rounded-xl border border-border bg-surface">
          <dl className="tabular grid gap-px bg-border" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <div className="flex flex-col gap-1 bg-surface p-5">
              <dt className="text-xs font-medium text-fg-3">Semana {36 + kpi.serie.length - 1}</dt>
              <dd className="flex items-baseline gap-1.5">
                <span className="text-[28px] font-semibold leading-none tracking-[-0.02em]">{formatNumber(kpi.valorActual, decimales)}</span>
                <span className="text-[13px] text-fg-3">{kpi.unidad}</span>
              </dd>
            </div>
            <div className="flex flex-col gap-1 bg-surface p-5">
              <dt className="text-xs font-medium text-fg-3">{esLimite ? "Límite" : "Meta"}</dt>
              <dd className="flex flex-col">
                <span className="text-lg font-semibold leading-snug">
                  {kpi.comparacion === "menor-mejor" ? "≤ " : ""}
                  {formatNumber(kpi.meta, decimales)} {kpi.unidad}
                </span>
                <span className={`text-[13px] font-medium ${diferenciaMeta * (kpi.comparacion === "mayor-mejor" ? 1 : -1) >= 0 ? "text-ok-fg" : "text-risk-fg"}`}>
                  {formatSigned(Math.abs(diferenciaMeta), decimales)} {kpi.unidad} {diferenciaMeta >= 0 ? "por encima" : "por debajo"}
                </span>
              </dd>
            </div>
            <div className="flex flex-col gap-1 bg-surface p-5">
              <dt className="text-xs font-medium text-fg-3">Semana anterior</dt>
              <dd className="flex flex-col">
                <span className="text-lg font-semibold leading-snug">
                  {formatNumber(semanaAnterior, decimales)} {kpi.unidad}
                </span>
                <span className="text-[13px] font-medium text-fg-2">vs. esta semana</span>
              </dd>
            </div>
            <div className="flex flex-col gap-1 bg-surface p-5">
              <dt className="text-xs font-medium text-fg-3">Promedio del periodo</dt>
              <dd className="flex flex-col">
                <span className="text-lg font-semibold leading-snug">
                  {formatNumber(promedio, decimales)} {kpi.unidad}
                </span>
                <span className="text-[13px] text-fg-3">
                  {semanasSobreMeta} de {kpi.serie.length} semanas {kpi.comparacion === "mayor-mejor" ? "sobre" : "bajo"} la meta
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <IndicadorTendenciaPeriodo kpi={kpi} esLimite={esLimite} decimales={decimales} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {kpi.slug === "costo-onza" && (
            <>
              <section className="rounded-xl border border-border bg-surface p-6">
                <div className="mb-1 flex flex-col gap-0.5">
                  <h2 className="text-[15px] font-semibold tracking-[-0.005em]">
                    Qué explica el aumento de {formatNumber(diferenciaMeta, 0)} USD/oz
                  </h2>
                  <p className="text-[13px] text-fg-2">Cambio de cada componente frente a la semana anterior</p>
                </div>
                <ul className="tabular mt-4 flex flex-col gap-3 text-[13px]">
                  {costoDesglose.explicacion.map((d) => {
                    const ancho = (Math.abs(d.puntos) / maxExplicacion) * 50;
                    const sube = d.puntos >= 0;
                    return (
                      <li key={d.nombre} className="grid grid-cols-[150px_1fr_56px] items-center gap-3">
                        <span className="font-medium text-fg">{d.nombre}</span>
                        <span aria-hidden className="relative h-2.5">
                          <span className="absolute inset-y-[-3px] left-1/2 w-px bg-border-strong" />
                          <span
                            className={`absolute inset-y-0 rounded-sm ${sube ? "bg-risk" : "bg-ok"}`}
                            style={{ left: sube ? "50%" : `${50 - ancho}%`, width: `${ancho}%` }}
                          />
                        </span>
                        <span className={`text-right font-semibold ${sube ? "text-risk-fg" : "text-ok-fg"}`}>
                          {formatSigned(Math.abs(d.puntos), 0)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 border-t border-border pt-3 text-[13px] text-fg-2">
                  <strong className="text-fg">Energía explica el {costoDesglose.energiaExplicaPct} % del aumento.</strong> Coincide con
                  la subida en la tarifa que reportó Servicios.
                </p>
              </section>

              <section className="rounded-xl border border-border bg-surface p-6">
                <div className="mb-1 flex flex-col gap-0.5">
                  <h2 className="text-[15px] font-semibold tracking-[-0.005em]">Composición del costo</h2>
                  <p className="text-[13px] text-fg-2">USD por onza en la semana actual y su peso en el total</p>
                </div>
                <ul className="tabular mt-4 flex flex-col gap-3.5 text-[13px]">
                  {costoDesglose.partes.map((p) => (
                    <li key={p.nombre} className="flex flex-col gap-1.5">
                      <span className="flex justify-between gap-3">
                        <span className="font-medium text-fg">{p.nombre}</span>
                        <span>
                          <strong>{formatNumber(p.valor)}</strong>{" "}
                          <span className="text-fg-3">· {formatNumber((p.valor / totalCosto) * 100, 1)} %</span>
                        </span>
                      </span>
                      <span aria-hidden className="block h-1.5 rounded-full bg-track">
                        <span className="block h-1.5 rounded-full bg-primary" style={{ width: `${(p.valor / costoDesglose.partes[0].valor) * 100}%` }} />
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="tabular mt-3 flex justify-between border-t border-border pt-3 font-semibold">
                  <span>Total</span>
                  <span>{formatNumber(totalCosto)} {kpi.unidad}</span>
                </div>
              </section>
            </>
          )}

          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="mb-3 text-[15px] font-semibold tracking-[-0.005em]">Con qué se relaciona</h2>
            <ul className="flex flex-col gap-3">
              {costoDesglose.relacionados.map((r) => (
                <li key={r.nombre} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex flex-col">
                    <span className="font-medium text-fg">{r.nombre}</span>
                    <span className="text-[13px] text-fg-3">
                      {r.area} · {r.nota}
                    </span>
                  </span>
                  <span className={`tabular font-semibold ${r.bueno ? "text-ok-fg" : "text-risk-fg"}`}>{r.valor}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="mb-3 text-[15px] font-semibold tracking-[-0.005em]">De dónde sale esta cifra</h2>
            <dl className="grid grid-cols-[96px_1fr] gap-x-4 gap-y-2.5 text-sm">
              <dt className="text-fg-3">Fórmula</dt>
              <dd>{kpi.descripcion}</dd>
              <dt className="text-fg-3">Archivo</dt>
              <dd>
                <span className="text-primary">{kpi.fuente.archivo}</span>, hoja {kpi.fuente.hoja}
              </dd>
              <dt className="text-fg-3">Cargado</dt>
              <dd className="tabular">{formatDate(kpi.fuente.cargado)}, por Carlos</dd>
            </dl>
            <p className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-[13px] font-medium text-ok-fg">
              <Check className="h-4 w-4" aria-hidden strokeWidth={2.5} />
              Calculado por el sistema con reglas fijas. La IA no escribe cifras.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
