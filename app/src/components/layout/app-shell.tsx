import { Sidebar } from "@/components/layout/sidebar";
import { SampleDataBanner } from "@/components/layout/sample-data-banner";
import { CommandPalette } from "@/components/layout/command-palette";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppShell({
  children,
  topbar = true,
}: {
  children: React.ReactNode;
  /** El Buscador trae su propia barra superior (la caja de búsqueda es la pantalla). */
  topbar?: boolean;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SampleDataBanner />
      <div className="flex flex-1">
        <Sidebar className="hidden md:flex" />
        <div className="flex min-w-0 flex-1 flex-col">
          {topbar && (
            <header className="flex items-center gap-4 border-b border-border bg-card px-4 py-3 md:px-8">
              <CommandPalette />
              <div className="ml-auto flex items-center gap-3">
                <ThemeToggle />
              </div>
            </header>
          )}
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
        </div>
      </div>
      <MobileTabbar />
    </div>
  );
}
