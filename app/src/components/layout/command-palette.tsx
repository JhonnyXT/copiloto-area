"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { FileBarChart, FileText, Search } from "lucide-react";
import { kpis, preguntasDemo } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  label: string;
  hint: string;
  icon: React.ElementType;
  href: string;
}

function buildItems(): Item[] {
  const kpiItems: Item[] = kpis.map((k) => ({
    id: `kpi-${k.slug}`,
    label: k.nombre,
    hint: "Indicador",
    icon: FileBarChart,
    href: `/indicadores/${k.slug}`,
  }));
  const docItems: Item[] = preguntasDemo.map((p) => ({
    id: `doc-${p.id}`,
    label: p.pregunta,
    hint: "Preguntar a tus documentos",
    icon: FileText,
    href: `/documentos?q=${p.id}`,
  }));
  return [...kpiItems, ...docItems];
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const items = React.useMemo(buildItems, []);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? items.filter((i) => i.label.toLowerCase().includes(query.trim().toLowerCase()))
    : items;

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 w-full max-w-[640px] items-center gap-2.5 rounded-[10px] border border-border bg-background px-3.5 text-left text-sm text-subtle-foreground transition-colors hover:border-input"
      >
        <Search className="h-[18px] w-[18px] shrink-0" aria-hidden strokeWidth={1.8} />
        <span className="flex-1 truncate">Pregúntale a tus documentos…</span>
        <kbd className="hidden shrink-0 rounded-md border border-input px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground sm:inline">
          Ctrl K
        </kbd>
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
          <Dialog.Content
            aria-describedby={undefined}
            className="shadow-float fixed left-1/2 top-[18%] z-50 w-[min(640px,92vw)] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out"
          >
            <Dialog.Title className="sr-only">Buscar</Dialog.Title>
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
              <Search className="h-[18px] w-[18px] shrink-0 text-subtle-foreground" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca un indicador o pregunta a tus documentos…"
                className="flex-1 bg-transparent text-sm text-popover-foreground outline-none placeholder:text-subtle-foreground"
              />
            </div>
            <div role="listbox" className="max-h-[320px] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-subtle-foreground">Sin resultados.</p>
              )}
              {filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go(item.href)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-popover-foreground",
                      "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-subtle-foreground" aria-hidden />
                    <span className="flex-1 truncate">{item.label}</span>
                    <span className="shrink-0 text-xs text-subtle-foreground">{item.hint}</span>
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
