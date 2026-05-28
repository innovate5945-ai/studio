// @file src/app/(auth)/layout.tsx
/**
 * @overview Auth route group shell — 사이드바·CooldownBanner 없이 children만 렌더.
 *
 * @call-flow
 * 1. /login, /register — AuthLayout pass-through
 * 2. AuthFormLayout — 전체 화면 중앙 Card 레이아웃
 *
 * @see src/app/layout.tsx, src/app/(auth)/login/page.tsx, src/app/(auth)/register/page.tsx
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
