import type {Metadata} from 'next';
import './globals.css';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CooldownBanner } from "@/components/dashboard/cooldown-banner";
import { FactBombAlertModal } from "@/components/ai/fact-bomb-modal";
import { DisciplineProvider } from "@/contexts/discipline-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'IronTrader | High-Performance Discipline Dashboard',
  description: 'Data-driven critique and discipline enforcement for professional traders.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/30">
        <DisciplineProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex-1 flex flex-col relative">
                <CooldownBanner />
                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
                  {children}
                </div>
              </main>
            </div>
            <FactBombAlertModal />
            <Toaster />
          </SidebarProvider>
        </DisciplineProvider>
      </body>
    </html>
  );
}
