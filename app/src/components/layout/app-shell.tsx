import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { SampleDataBanner } from "@/components/layout/sample-data-banner";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";

export function AppShell({
  children,
  ruta,
}: {
  children: React.ReactNode;
  ruta: { label: string; href?: string }[];
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SampleDataBanner />
      <div className="flex flex-1">
        <Sidebar className="hidden md:flex" />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar ruta={ruta} />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
        </div>
      </div>
      <MobileTabbar />
    </div>
  );
}
