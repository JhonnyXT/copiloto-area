import { AppShell } from "@/components/layout/app-shell";
import { AccionesDocumentos, BuscadorDemo } from "@/components/documentos/buscador-demo";

export default function DocumentosPage() {
  return (
    <AppShell
      titulo="Pregúntale a tus documentos"
      descripcion="Cada respuesta cita el documento y la página. Si no está en ellos, te lo dice."
      acciones={<AccionesDocumentos />}
    >
      <div className="p-4 md:p-5">
        <BuscadorDemo />
      </div>
    </AppShell>
  );
}
