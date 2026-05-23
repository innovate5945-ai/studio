import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type AuthFormLayoutProps = {
  title: string
  description: string
  children: React.ReactNode
  footer: React.ReactNode
}

/**
 * @fileOverview [UI-AUTH-001] 인증 페이지 공통 레이아웃 (Mobile-first)
 */
export function AuthFormLayout({ title, description, children, footer }: AuthFormLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-[420px] space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-headline font-bold text-2xl">IronTrader</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Professional trading discipline dashboard
          </p>
        </div>

        <Card className="border-white/10 bg-card/60 backdrop-blur-sm shadow-xl w-full">
          <CardHeader className="space-y-1.5 px-4 pt-6 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-headline font-bold">{title}</CardTitle>
            <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-6 sm:px-6">{children}</CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground px-2">{footer}</div>
      </div>
    </div>
  )
}
