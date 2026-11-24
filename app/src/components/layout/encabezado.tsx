import { BotonCerrarSesion, BotonTema } from "@/components/layout/acciones-cuenta";
import { CommandPalette } from "@/components/layout/command-palette";

export interface EncabezadoProps {
  titulo: string;
  descripcion: string;
  estado?: React.ReactNode;
  acciones?: React.ReactNode;
}

export function Encabezado({ titulo, descripcion, estado, acciones }: EncabezadoProps) {
  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-border bg-surface px-4 py-3.5 md:px-6">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <h1 className="text-xl font-semibold tracking-[-0.015em] text-fg">{titulo}</h1>
          {estado}
        </div>
        <p className="tabular text-[13px] text-fg-2">{descripcion}</p>
      </div>

      <div className="flex shrink-0 gap-1.5 self-start md:hidden">
        <CommandPalette compacta />
        <BotonTema compacta />
        <BotonCerrarSesion compacta />
      </div>

      {acciones && <div className="flex w-full flex-wrap gap-2 md:w-auto">{acciones}</div>}
    </header>
  );
}
