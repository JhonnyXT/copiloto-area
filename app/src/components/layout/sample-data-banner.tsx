import { Info } from "lucide-react";

/**
 * Permanente, sin botón de cerrar — requisito de producto, no de estilo.
 * PRODUCT.md "Operating Context".
 */
export function SampleDataBanner() {
  return (
    <div className="flex items-center justify-center gap-2 bg-accent-soft px-4 py-2 text-center text-[13px] font-medium text-accent-soft-foreground">
      <Info className="h-3.5 w-3.5 shrink-0" aria-hidden strokeWidth={2} />
      <span>Datos de ejemplo · Ninguna cifra ni documento de esta versión es real</span>
    </div>
  );
}
