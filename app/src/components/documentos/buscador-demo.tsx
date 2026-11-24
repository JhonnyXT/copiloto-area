"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ExternalLink, File, Search, SearchX, Send, UploadCloud } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { documentos, preguntasDemo, preguntasSugeridas, type DocCita } from "@/lib/demo-data";

// Preguntas fijas de ejemplo: la búsqueda real con IA es la Fase 3, pendiente.
export function BuscadorDemo() {
  const todasLasCitas = React.useMemo(() => {
    const mapa = new Map<string, DocCita>();
    preguntasDemo.forEach((p) => p.citas.forEach((c) => mapa.set(c.id, c)));
    return mapa;
  }, []);
  const primeraCita = preguntasDemo[0]?.citas[0]?.id ?? "";
  const [citaActivaId, setCitaActivaId] = React.useState(primeraCita);
  const citaActiva = todasLasCitas.get(citaActivaId);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] xl:items-start">
      <section aria-label="Conversación" className="flex min-w-0 flex-col gap-5">
        {preguntasDemo.map((p) => (
          <React.Fragment key={p.id}>
            <div className="self-end max-w-[78%] rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[15px]">
              {p.pregunta}
            </div>

            {p.respuesta ? (
              <article className="flex flex-col gap-3.5 rounded-xl border border-border bg-surface p-5">
                <div className="flex items-center gap-2 text-[13px] text-fg-3">
                  <File className="h-4 w-4" aria-hidden strokeWidth={1.75} />
                  Respuesta basada en {p.citas.length} documento{p.citas.length === 1 ? "" : "s"}
                </div>
                <div className="flex flex-col gap-2.5 text-[15px] leading-7">
                  {p.respuesta.map((bloque, i) => (
                    <p key={i} className="m-0">
                      {bloque.texto}
                      {bloque.citas.map((citaId) => {
                        const numero = p.citas.findIndex((c) => c.id === citaId) + 1;
                        return (
                          <CitaBoton key={citaId} numero={numero} activa={citaActivaId === citaId} onClick={() => setCitaActivaId(citaId)} />
                        );
                      })}
                    </p>
                  ))}
                </div>
                <div className="flex flex-col gap-2 border-t border-border pt-3.5">
                  <span className="text-[13px] font-medium text-fg-2">Fuentes</span>
                  <div className="flex flex-col gap-2">
                    {p.citas.map((c, i) => (
                      <FuenteBoton key={c.id} numero={i + 1} cita={c} activa={citaActivaId === c.id} onClick={() => setCitaActivaId(c.id)} />
                    ))}
                  </div>
                </div>
              </article>
            ) : (
              <article className="flex gap-3.5 rounded-xl border border-border bg-surface p-5">
                <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-fg-2">
                  <SearchX className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.75} />
                </span>
                <div className="flex flex-col gap-2.5">
                  <p className="m-0 text-[15px] leading-7">
                    <strong>No encontré esto en tus documentos.</strong> Ninguno menciona lo que preguntas directamente.
                    {p.sugerenciaNoEncontrada && " Lo más cercano es el documento de abajo."}
                  </p>
                  <div className="flex flex-col gap-2">
                    {p.citas.map((c, i) => (
                      <FuenteBoton key={c.id} numero={i + 1} cita={c} activa={citaActivaId === c.id} onClick={() => setCitaActivaId(c.id)} relacionado />
                    ))}
                  </div>
                  <span className="text-[13px] text-fg-2">
                    Si tienes el documento correcto, súbelo y vuelve a preguntar.
                  </span>
                </div>
              </article>
            )}
          </React.Fragment>
        ))}

        <div className="flex items-center gap-2 rounded-xl border border-border-strong bg-surface p-1.5 pl-3.5">
          <label className="sr-only" htmlFor="pregunta">
            Tu pregunta
          </label>
          <input
            id="pregunta"
            type="text"
            placeholder="Escribe tu pregunta, por ejemplo: ¿quién aprueba un permiso de trabajo en altura?"
            className="h-10 flex-1 bg-transparent text-[15px] outline-none placeholder:text-fg-3"
          />
          <button type="button" className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-on-primary hover:bg-primary-hover">
            <Send className="h-4 w-4" aria-hidden strokeWidth={1.75} />
            Preguntar
          </button>
        </div>
        <div className="-mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-fg-3">Prueba con:</span>
          {preguntasSugeridas.map((s) => (
            <button key={s} type="button" className="flex h-[30px] items-center rounded-full border border-border bg-surface px-3 text-[13px] text-fg-2 hover:border-border-strong hover:text-fg">
              {s}
            </button>
          ))}
        </div>
      </section>

      <aside aria-label="Documento citado" className="overflow-hidden rounded-xl border border-border bg-surface xl:sticky xl:top-5">
        {citaActiva ? (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-border p-4">
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold">{citaActiva.documento}</span>
                <span className="tabular text-[13px] text-fg-3">
                  {citaActiva.codigo} · Página {citaActiva.pagina} de {citaActiva.totalPaginas}
                </span>
              </div>
              <div className="flex shrink-0 gap-1">
                <button type="button" aria-label="Página anterior" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong hover:bg-surface-2">
                  <ChevronLeft className="h-4 w-4" aria-hidden strokeWidth={1.75} />
                </button>
                <button type="button" aria-label="Página siguiente" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong hover:bg-surface-2">
                  <ChevronRight className="h-4 w-4" aria-hidden strokeWidth={1.75} />
                </button>
              </div>
            </div>
            <div className="bg-surface-2 p-5">
              <div className="rounded border border-border bg-surface px-[22px] py-6 text-[12.5px] leading-[1.7] text-fg-2">
                {citaActiva.parrafos.map((p, i) => (
                  <p key={i} className="m-0 mb-2.5 last:mb-0">
                    {p.titulo && <span className="mb-2.5 block text-xs font-semibold text-fg">{p.titulo}</span>}
                    {p.antes}
                    {p.resaltado && <mark className="rounded-[2px] bg-mark px-0 py-px text-mark-fg">{p.resaltado}</mark>}
                    {p.despues}
                  </p>
                ))}
              </div>
            </div>
            <div className="tabular flex items-center justify-between gap-3 border-t border-border p-4 text-[13px]">
              <a href="#" className="flex items-center gap-1.5 font-medium">
                Abrir documento completo
                <ExternalLink className="h-3.5 w-3.5" aria-hidden strokeWidth={1.75} />
              </a>
              <span className="text-fg-3">Subido {formatDate(citaActiva.cargado)}</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 p-10 text-center text-sm text-fg-3">
            <Search className="h-5 w-5" aria-hidden strokeWidth={1.5} />
            Haz clic en una cita para ver el documento.
          </div>
        )}
      </aside>
    </div>
  );
}

function CitaBoton({ numero, activa, onClick }: { numero: number; activa: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Ver fuente ${numero}`}
      className={cn(
        "tabular mx-0.5 inline-flex h-[18px] min-w-5 items-center justify-center rounded px-1 align-[2px] text-[11px] font-semibold",
        activa ? "bg-primary text-on-primary" : "bg-primary-soft text-primary-soft-fg hover:bg-primary hover:text-on-primary",
      )}
    >
      {numero}
    </button>
  );
}

function FuenteBoton({
  numero,
  cita,
  activa,
  onClick,
  relacionado,
}: {
  numero: number;
  cita: DocCita;
  activa: boolean;
  onClick: () => void;
  relacionado?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activa}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 text-left transition-colors hover:border-border-strong hover:bg-surface-2",
        activa && "border-primary bg-sel hover:border-primary hover:bg-sel",
      )}
    >
      <span
        className={cn(
          "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-xs font-semibold text-fg-2",
          activa && "border-primary bg-primary text-on-primary",
        )}
      >
        {numero}
      </span>
      <span className="flex min-w-0 flex-1 flex-col leading-snug">
        <span className="truncate text-sm font-medium">{cita.documento}</span>
        <span className="tabular text-[13px] text-fg-3">
          {cita.codigo} · página {cita.pagina}
          {relacionado && " · relacionado, no responde la pregunta"}
        </span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-fg-3" aria-hidden strokeWidth={1.75} />
    </button>
  );
}

export function EncabezadoDocumentos() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-[-0.015em] text-fg">Pregúntale a tus documentos</h1>
        <p className="text-sm text-fg-2">Responde solo con lo que está en ellos y cita el documento y la página. Si no lo encuentra, te lo dice.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="flex h-9 items-center gap-2 rounded-lg border border-border-strong bg-surface px-3.5 text-sm font-medium hover:bg-surface-2">
          Todos los documentos ({documentos.total})
        </button>
        <button type="button" className="flex h-9 items-center gap-2 rounded-lg border border-border-strong bg-surface px-3.5 text-sm font-medium hover:bg-surface-2">
          <UploadCloud className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.75} />
          Subir documentos
        </button>
      </div>
    </div>
  );
}
