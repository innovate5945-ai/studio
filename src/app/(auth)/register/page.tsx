// @file src/app/(auth)/register/page.tsx
/**
 * @overview [UI-AUTH-001] 회원가입 페이지 — AuthFormLayout + RegisterForm.
 *
 * @call-flow
 * 1. /register → RegisterPage (metadata)
 * 2. AuthFormLayout → RegisterForm
 * 3. submit → registerUser (action) → toast + router.push("/login")
 *
 * @see src/components/auth/register-form.tsx, src/components/auth/auth-form-layout.tsx, src/actions/auth.ts
 */
import type { Metadata } from "next"
import { AuthFormLayout } from "@/components/auth/auth-form-layout"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "회원가입 | IronTrader",
  description: "IronTrader 계정을 생성하세요.",
}

export default function RegisterPage() {
  return (
    <AuthFormLayout
      title="회원가입"
      description="매매 데이터를 안전하게 보관할 IronTrader 계정을 만듭니다."
      footer={
        <p>
          가입 시 IronTrader의 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      }
    >
      <RegisterForm />
    </AuthFormLayout>
  )
}
