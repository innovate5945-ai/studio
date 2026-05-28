// @file src/app/(dashboard)/layout.tsx
/**
 * @overview Dashboard Layout — Sidebar, CooldownBanner, FactBombAlertModal, main content area.
 *
 * @call-flow
 * (dashboard)/layout → AppSidebar + CooldownBanner + {children}
 *
 * @see src/components/layout/app-sidebar.tsx
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
