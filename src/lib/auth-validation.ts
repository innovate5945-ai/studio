// @file src/lib/auth-validation.ts
/**
 * @overview [UI-AUTH-001] 로그인/회원가입 Zod 스키마·AuthResult 타입. Server Action과 UI 공유.
 *
 * @call-flow
 * 1. LoginForm → loginSchema.safeParse (클라이언트)
 * 2. RegisterForm → registerSchema.safeParse (클라이언트)
 * 3. actions/auth.ts → loginUser / registerUser 재검증
 *
 * @see src/actions/auth.ts, src/components/auth/login-form.tsx
 */
import { z } from 'zod';

/** 이메일 형식 검증 스키마 */
export const emailSchema = z
  .string()
  .min(1, '이메일을 입력해 주세요.')
  .email('올바른 이메일 형식이 아닙니다.');

export const passwordSchema = z
  .string()
  .min(1, '비밀번호를 입력해 주세요.')
  .min(8, '비밀번호는 8자 이상이어야 합니다.')
  .regex(/[A-Z]/, '대문자를 1자 이상 포함해야 합니다.')
  .regex(/[a-z]/, '소문자를 1자 이상 포함해야 합니다.')
  .regex(/[0-9]/, '숫자를 1자 이상 포함해야 합니다.');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '비밀번호를 입력해 주세요.'),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해 주세요.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export type AuthResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type AuthFieldErrors = Partial<Record<keyof LoginInput | keyof RegisterInput, string>>;
