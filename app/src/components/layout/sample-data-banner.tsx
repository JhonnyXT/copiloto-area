import { Info } from "lucide-react";

// Sin botón de cerrar a propósito: requisito de producto (PRODUCT.md), no un olvido de estilo.
export function SampleDataBanner() {
  return (
    <div role="note" className="flex h-8 items-center justify-center gap-2 bg-banner-bg px-4 text-center text-[13px] font-medium text-banner-fg">
      <Info className="h-3.5 w-3.5 shrink-0" aria-hidden strokeWidth={2} />
      <span>Estás viendo datos de ejemplo. Ninguna cifra ni documento de esta versión es real.</span>
    </div>
  );
}
