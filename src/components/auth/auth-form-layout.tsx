// @file src/components/auth/auth-form-layout.tsx
/**
 * @overview [UI-AUTH-001] 인증 페이지 공통 레이아웃 — 브랜딩·Card·footer 슬롯.
 *
 * @call-flow
 * 1. login/page | register/page → AuthFormLayout { title, description, footer }
 * 2. IronTrader 로고 + CardHeader + children (LoginForm | RegisterForm)
 *
 * @see src/app/(auth)/login/page.tsx, src/app/(auth)/register/page.tsx
 */
import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type AuthFormLayoutProps = {
  title: string
  description: string
  children: React.ReactNode
  footer: React.ReactNode
}


/** 로그인·회원가입 페이지 공통 Card 레이아웃. */
export function AuthFormLayout({ title, description, children, footer }: AuthFormLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-[420px] space-y-8">
        <div className="flex flex-col items-center space-y-3 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary">
              <ShieldAlert className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-headline text-2xl font-bold tracking-tight">IronTrader</span>
          </Link>
          <p className="prose-muted max-w-xs">
            Professional trading discipline dashboard
          </p>
        </div>

        <Card className="surface-card w-full shadow-xl">
          <CardHeader className="space-y-2 px-4 pt-6 sm:px-6">
            <CardTitle className="font-headline text-xl font-semibold sm:text-2xl">{title}</CardTitle>
            <CardDescription className="leading-relaxed">{description}</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-6 sm:px-6">{children}</CardContent>
        </Card>

        <div className="px-2 text-center text-sm leading-relaxed text-muted-foreground">{footer}</div>
      </div>
    </div>
  )
}
