'use server';

import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from '@/lib/auth-validation';

export type AuthResult =
  | { success: true; message: string }
  | { success: false; error: string };

// TODO: Replace with Firebase Auth when Authenticated Vault is wired up.
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
