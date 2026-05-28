// @file src/app/(dashboard)/layout.tsx
/**
 * @overview Dashboard Layout — SidebarProvider, AppSidebar, CooldownBanner, FactBombAlertModal.
 *
 * @call-flow
 * 1. Root layout DisciplineProvider 하위 — (dashboard)/* routes
 * 2. SidebarProvider → AppSidebar + main {children}
 * 3. CooldownBanner (sticky) + FactBombAlertModal (portal)
 *
 * @see src/app/layout.tsx, src/components/layout/app-sidebar.tsx, src/components/dashboard/cooldown-banner.tsx
 */
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CooldownBanner } from "@/components/dashboard/cooldown-banner";
import { FactBombAlertModal } from "@/components/ai/fact-bomb-modal";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col relative min-w-0">
          <CooldownBanner />
          <div className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      <FactBombAlertModal />
    </SidebarProvider>
  );
}
