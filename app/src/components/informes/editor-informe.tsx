"use client";

import * as React from "react";
import { CircleCheckBig, FileDown, Info, RotateCcw } from "lucide-react";
import { StatusChip } from "@/components/ui/status-chip";
import { cn } from "@/lib/utils";
import { informeSemanal } from "@/lib/demo-data";

export function EditorInforme() {
  const [activas, setActivas] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(informeSemanal.secciones.map((s) => [s.id, s.activaPorDefecto])),
  );

  const cifrasActivas = informeSemanal.secciones
    .filter((s) => activas[s.id])
    .reduce((acc, s) => acc + s.cifras, 0);

  function alternar(id: string) {
    setActivas((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <article className="overflow-hidden rounded-xl border border-border bg-surface">
        <div role="toolbar" aria-label="Formato" className="flex flex-wrap items-center gap-1 border-b border-border bg-surface-2 px-2.5 py-1.5">
          <ToolButton>Párrafo</ToolButton>
          <span aria-hidden className="mx-1.5 h-[18px] w-px bg-border-strong" />
          <ToolButton negrita>B</ToolButton>
          <ToolButton cursiva>I</ToolButton>
          <ToolButton>Lista</ToolButton>
          <span aria-hidden className="mx-1.5 h-[18px] w-px bg-border-strong" />
          <ToolButton destacado>
            <Info className="h-3.5 w-3.5" aria-hidden /> Insertar cifra
          </ToolButton>
          <span className="ml-auto hidden text-xs text-fg-3 sm:inline">Las cifras solo se insertan desde tus datos</span>
        </div>

        <div className="bg-surface px-6 py-10 sm:px-12">
          <div className="mx-auto max-w-[68ch] text-[15px] leading-7 text-fg">
            <p className="tabular mb-1.5 text-[13px] text-fg-3">Área de Operaciones (ejemplo) · 17 al 23 de noviembre de 2026</p>
            {/* No es un <h1>: la página ya tiene el suyo arriba; esto es el título visual del documento impreso. */}
            <p className="mb-5 text-[26px] font-semibold leading-tight tracking-[-0.02em] text-fg">Informe semanal de operaciones</p>

            {informeSemanal.secciones.map(
              (seccion) =>
                activas[seccion.id] && (
                  <React.Fragment key={seccion.id}>
                    <h2 className="mb-2 mt-7 text-[17px] font-semibold tracking-[-0.01em]">{seccion.titulo}</h2>
                    {seccion.parrafos.map((parrafo, i) => (
                      <p key={i} className="mb-3">
                        {parrafo.map((parte, j) =>
                          "cifra" in parte ? (
                            <mark
                              key={j}
                              title={parte.origen}
                              className="tabular cursor-help rounded-[3px] border-b border-dashed border-primary-soft-fg/60 bg-primary-soft px-[3px] font-semibold text-primary-soft-fg"
                            >
                              {parte.cifra}
                            </mark>
                          ) : (
                            <React.Fragment key={j}>{parte.texto}</React.Fragment>
                          ),
                        )}
                      </p>
                    ))}
                  </React.Fragment>
                ),
            )}

            <h2 className="mb-2 mt-7 text-[17px] font-semibold tracking-[-0.01em]">Próximos pasos</h2>
            <ul className="mb-3 flex list-disc flex-col gap-1.5 pl-5">
              {informeSemanal.proximosPasos.map((paso) => (
                <li key={paso}>{paso}</li>
              ))}
            </ul>
            <p className="text-fg-3">Escribe aquí tus compromisos de la semana…</p>
          </div>
        </div>
      </article>

      <aside className="flex flex-col gap-4">
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3.5 text-[15px] font-semibold tracking-[-0.005em]">Revisión</h2>
          <ol className="flex flex-col gap-3.5">
            <PasoRevision estado="hecho" titulo="Redactado" detalle="Hoy, 7:12 a. m." />
            <PasoRevision estado="actual" numero={2} titulo="Revisado por ti" detalle="Lee el texto y ajusta lo que quieras" />
            <PasoRevision estado="pendiente" numero={3} titulo="Exportado" detalle="PDF o Word" />
          </ol>
        </section>

        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <h2 className="text-[15px] font-semibold tracking-[-0.005em]">Cifras</h2>
            <StatusChip estado="ok">{cifrasActivas} verificadas</StatusChip>
          </div>
          <p className="text-[13px] text-fg-2">
            Cada cifra resaltada sale de tus datos y coincide con ellos. Pasa el cursor sobre una para ver de dónde viene.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="px-1 pb-2 text-[15px] font-semibold tracking-[-0.005em]">Secciones del informe</h2>
          {informeSemanal.secciones.map((seccion) => (
            <label key={seccion.id} className="flex min-h-10 items-center justify-between gap-3 text-sm">
              <span>{seccion.titulo}</span>
              <Interruptor checked={!!activas[seccion.id]} onChange={() => alternar(seccion.id)} etiqueta={seccion.titulo} />
            </label>
          ))}
        </section>
      </aside>
    </div>
  );
}

function ToolButton({
  children,
  negrita,
  cursiva,
  destacado,
}: {
  children: React.ReactNode;
  negrita?: boolean;
  cursiva?: boolean;
  destacado?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-[30px] min-w-[30px] items-center justify-center gap-1.5 rounded-md px-2 text-[13px] font-medium text-fg-2 hover:bg-surface hover:text-fg",
        negrita && "font-bold",
        cursiva && "italic",
        destacado && "text-primary",
      )}
    >
      {children}
    </button>
  );
}

function Interruptor({ checked, onChange, etiqueta }: { checked: boolean; onChange: () => void; etiqueta: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={etiqueta}
      onClick={onChange}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors",
        checked ? "bg-primary" : "bg-border-strong",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-hover transition-transform",
          checked && "translate-x-4",
        )}
      />
    </button>
  );
}

function PasoRevision({
  estado,
  numero,
  titulo,
  detalle,
}: {
  estado: "hecho" | "actual" | "pendiente";
  numero?: number;
  titulo: string;
  detalle: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={cn(
          "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          estado === "hecho" && "bg-ok-soft text-ok-fg",
          estado === "actual" && "bg-primary text-on-primary",
          estado === "pendiente" && "bg-surface-2 text-fg-3 shadow-[inset_0_0_0_1px_var(--border-strong)]",
        )}
      >
        {estado === "hecho" ? <CircleCheckBig className="h-3 w-3" aria-hidden strokeWidth={2.5} /> : numero}
      </span>
      <span className="flex flex-col">
        <span className={cn("font-medium", estado === "pendiente" && "text-fg-2")}>{titulo}</span>
        <span className="tabular text-[13px] text-fg-3">{detalle}</span>
      </span>
    </li>
  );
}

export function BotonesInforme() {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className="flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-medium text-fg-2 hover:bg-surface-2 hover:text-fg">
        <RotateCcw className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.75} />
        Volver a redactar
      </button>
      <button type="button" className="flex h-9 items-center gap-2 rounded-lg border border-border-strong bg-surface px-3.5 text-sm font-medium hover:bg-surface-2">
        <FileDown className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.75} />
        Word
      </button>
      <button type="button" className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-on-primary hover:bg-primary-hover">
        <FileDown className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.75} />
        Descargar PDF
      </button>
    </div>
  );
}

