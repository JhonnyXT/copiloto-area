import { Encabezado, type EncabezadoProps } from "@/components/layout/encabezado";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { SampleDataBanner } from "@/components/layout/sample-data-banner";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children, ...encabezado }: EncabezadoProps & { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col md:h-dvh md:overflow-hidden">
      <SampleDataBanner />
      <div className="flex min-h-0 flex-1">
        <Sidebar className="hidden md:flex" />
        <div className="flex min-w-0 flex-1 flex-col">
          <Encabezado {...encabezado} />
          <main className="relative min-h-0 flex-1 pb-20 md:overflow-y-auto md:pb-0">{children}</main>
        </div>
      </div>
      <MobileTabbar />
    </div>
  );
}
