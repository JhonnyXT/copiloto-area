import { AppShell } from "@/components/layout/app-shell";
import { BuscadorDemo, EncabezadoDocumentos } from "@/components/documentos/buscador-demo";

export default function DocumentosPage() {
  return (
    <AppShell ruta={[{ label: "Operaciones" }, { label: "Documentos" }]}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-5 p-4 md:p-7">
        <EncabezadoDocumentos />
        <BuscadorDemo />
      </div>
    </AppShell>
  );
}
