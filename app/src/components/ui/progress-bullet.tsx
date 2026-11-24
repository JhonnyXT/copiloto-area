import { cn } from "@/lib/utils";
import type { Estado } from "@/lib/demo-data";

const colorRelleno: Record<Estado, string> = {
  ok: "bg-ok",
  warn: "bg-warn",
  risk: "bg-risk",
};

export function ProgressBullet({
  valor,
  meta,
  estado,
  className,
}: {
  valor: number;
  meta: number;
  estado: Estado;
  className?: string;
}) {
  const escala = Math.max(valor, meta, 1) * 1.25;
  const porcentajeValor = Math.min(100, (Math.abs(valor) / escala) * 100);
  const porcentajeMeta = Math.min(100, (meta / escala) * 100);

  return (
    <div className={cn("relative h-1.5 rounded-full bg-track", className)} aria-hidden>
      <div className={cn("absolute inset-y-0 left-0 rounded-full", colorRelleno[estado])} style={{ width: `${porcentajeValor}%` }} />
      <div className="absolute -top-1 h-3.5 w-0.5 rounded-sm bg-fg" style={{ left: `${porcentajeMeta}%` }} />
    </div>
  );
}
