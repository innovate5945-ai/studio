'use server';

// @file src/actions/auth.ts
/**
 * @overview [UI-AUTH-001] 인증 Server Actions — 로그인/회원가입 mock 처리.
 *
 * @call-flow
 * 1. login/page → LoginForm submit → loginUser(input)
 * 2. register/page → RegisterForm submit → registerUser(input)
 * 3. loginSchema / registerSchema.safeParse (lib) → AuthResult { success, message | error }
 *
 * @constraints "use server" — async function만 export. 스키마/타입은 lib/auth-validation.ts.
 * @see src/lib/auth-validation.ts, src/components/auth/login-form.tsx, src/components/auth/register-form.tsx
 */
import {
  loginSchema,
  registerSchema,
  type AuthResult,
  type LoginInput,
  type RegisterInput,
} from '@/lib/auth-validation';

// TODO: Replace with Firebase Auth when Authenticated Vault is wired up.

/** 이메일/비밀번호로 로그인합니다 (mock). */
export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? '입력값이 올바르지 않습니다.',
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 800));
  return { success: true, message: '로그인되었습니다.' };
}

/** 회원가입을 처리합니다 (mock). */
export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? '입력값이 올바르지 않습니다.',
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 800));
  return { success: true, message: '회원가입이 완료되었습니다.' };
}
