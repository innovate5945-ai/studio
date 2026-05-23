import type { Metadata } from "next"
import { AuthFormLayout } from "@/components/auth/auth-form-layout"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "로그인 | IronTrader",
  description: "IronTrader 계정으로 로그인하세요.",
}

export default function LoginPage() {
  return (
    <AuthFormLayout
      title="로그인"
      description="이메일과 비밀번호로 IronTrader에 접속합니다."
      footer={
        <p>
          트레이딩 규율 대시보드 ·{" "}
          <span className="text-foreground/70">Secure Vault Access</span>
        </p>
      }
    >
      <LoginForm />
    </AuthFormLayout>
  )
}
