import Link from "next/link";
import { BadgeDollarSign, Gauge, HardHat, ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatNumber } from "@/lib/utils";
import type { Kpi } from "@/lib/demo-data";

const iconos: Record<string, React.ElementType> = {
  produccion: Gauge,
  "costo-onza": BadgeDollarSign,
  seguridad: ShieldCheck,
  mantenimiento: HardHat,
};

function mensajeEstado(kpi: Kpi) {
  const signo = kpi.variacion > 0 ? "+" : "";
  if (kpi.slug === "seguridad") return "142 días sin eventos";
  if (kpi.estado === "cumple") return `${signo}${formatNumber(kpi.variacion, 1)} % sobre meta`;
  if (kpi.estado === "atencion") return `${formatNumber(Math.abs(kpi.variacion), 0)} pts bajo meta`;
  return `${signo}${formatNumber(kpi.variacion, 1)} % sobre meta`;
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = iconos[kpi.slug] ?? Gauge;
  return (
    <Link
      href={`/indicadores/${kpi.slug}`}
      className="group flex flex-col gap-3.5 rounded-xl border border-border bg-card p-5 transition-[box-shadow,border-color] hover:border-primary/30 hover:shadow-hover"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary-soft text-primary-soft-foreground">
          <Icon className="h-5 w-5" aria-hidden strokeWidth={1.8} />
        </span>
        <StatusBadge estado={kpi.estado}>{mensajeEstado(kpi)}</StatusBadge>
      </div>
      <span className="text-sm text-muted-foreground">{kpi.nombre}</span>
      <div className="tabular flex items-baseline gap-1.5">
        <span className="text-[32px] font-bold leading-none text-card-foreground">
          {formatNumber(kpi.valor, kpi.unidad === "%" ? 0 : kpi.valor % 1 ? 1 : 0)}
        </span>
        <span className="text-sm font-medium text-muted-foreground">{kpi.unidad}</span>
      </div>
      <span className="tabular text-xs text-subtle-foreground">
        Meta {kpi.comparacion === "menor-mejor" ? "≤ " : ""}
        {formatNumber(kpi.meta)} {kpi.unidad} · Semana {47}
      </span>
    </Link>
  );
}
