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
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
            {children}
          </div>
        </main>
      </div>
      <FactBombAlertModal />
    </SidebarProvider>
  );
}
