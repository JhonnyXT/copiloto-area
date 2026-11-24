import { cn } from "@/lib/utils";

interface BotonProximamenteProps {
  children: React.ReactNode;
  paraQueSirve: string;
  className?: string;
  "aria-label"?: string;
}

export function BotonProximamente({ children, paraQueSirve, className, ...resto }: BotonProximamenteProps) {
  return (
    <button
      type="button"
      disabled
      title={`Próximamente: ${paraQueSirve}`}
      className={cn("flex cursor-not-allowed items-center gap-2 opacity-50", className)}
      {...resto}
    >
      {children}
    </button>
  );
}
