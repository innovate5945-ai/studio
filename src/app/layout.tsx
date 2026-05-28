// @file src/app/layout.tsx
/**
 * @overview Root Layout — HTML shell, fonts, 전역 DisciplineProvider·Toaster.
 *
 * @call-flow
 * 1. app/layout.tsx — metadata, globals.css, dark theme
 * 2. DisciplineProvider → (auth) | (dashboard) route groups
 * 3. Toaster — useToast() 전역 알림
 *
 * @see src/contexts/discipline-provider.tsx, src/app/(dashboard)/layout.tsx, src/app/(auth)/layout.tsx
 */
import type {Metadata} from 'next';
import './globals.css';
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
    <html lang="ko" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body selection:bg-primary/30">
        <DisciplineProvider>
          {children}
          <Toaster />
        </DisciplineProvider>
      </body>
    </html>
  );
}
