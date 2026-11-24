"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { FileBarChart, MessageCircleQuestion, Search } from "lucide-react";
import { kpis, preguntasDemo } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  label: string;
  hint: string;
  icon: React.ElementType;
  href: string;
}

function construirItems(): Item[] {
  const deIndicadores: Item[] = kpis.map((k) => ({
    id: `kpi-${k.slug}`,
    label: k.nombre,
    hint: "Indicador",
    icon: FileBarChart,
    href: `/indicadores/${k.slug}`,
  }));
  const deDocumentos: Item[] = preguntasDemo.map((p) => ({
    id: `doc-${p.id}`,
    label: p.pregunta,
    hint: "Preguntar a tus documentos",
    icon: MessageCircleQuestion,
    href: `/documentos?q=${p.id}`,
  }));
  return [...deIndicadores, ...deDocumentos];
}

export function CommandPalette({ className }: { className?: string }) {
  const [abierto, setAbierto] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const items = React.useMemo(() => construirItems(), []);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtrados = query.trim()
    ? items.filter((i) => i.label.toLowerCase().includes(query.trim().toLowerCase()))
    : items;

  // Reiniciar la pregunta y enfocar el campo al abrir: se dispara desde el
  // propio evento de apertura (botón, atajo de teclado o Radix), nunca desde
  // un efecto — así no hay un setState síncrono dentro de un efecto.
  function manejarCambioAbierto(nuevo: boolean) {
    setAbierto(nuevo);
    if (nuevo) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        manejarCambioAbierto(!abierto);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // Se vuelve a enganchar en cada cambio de `abierto` para que el atajo
    // siempre alterne el estado correcto; es un solo listener global y
    // barato de recrear.
  }, [abierto]);

  function ir(href: string) {
    setAbierto(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => manejarCambioAbierto(true)}
        className={cn(
          "flex h-[34px] w-80 max-w-full items-center gap-2 rounded-lg border border-border bg-surface-2 px-2.5 text-left text-[13px] text-fg-3 hover:border-border-strong",
          className,
        )}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden strokeWidth={1.75} />
        <span className="flex-1 truncate">Buscar o preguntar a tus documentos</span>
        <kbd className="shrink-0 rounded-md border border-border-strong px-1.5 py-0.5 text-[11px] font-medium text-fg-3">
          Ctrl K
        </kbd>
      </button>

      <Dialog.Root open={abierto} onOpenChange={manejarCambioAbierto}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-fg/20 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
          <Dialog.Content
            aria-describedby={undefined}
            className="shadow-pop fixed left-1/2 top-[18%] z-50 w-[min(640px,92vw)] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-surface data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out"
          >
            <Dialog.Title className="sr-only">Buscar</Dialog.Title>
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
              <Search className="h-[18px] w-[18px] shrink-0 text-fg-3" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca un indicador o pregunta a tus documentos…"
                className="flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-3"
              />
            </div>
            <div role="listbox" className="max-h-[320px] overflow-y-auto p-1.5">
              {filtrados.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-fg-3">Sin resultados.</p>
              )}
              {filtrados.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => ir(item.href)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-fg hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-fg-3" aria-hidden />
                    <span className="flex-1 truncate">{item.label}</span>
                    <span className="shrink-0 text-xs text-fg-3">{item.hint}</span>
                  </button>
                );
              })}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
