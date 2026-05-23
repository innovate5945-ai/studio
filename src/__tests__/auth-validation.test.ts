import { loginSchema, registerSchema } from '@/lib/auth-validation';

describe('auth-validation', () => {
  describe('loginSchema', () => {
    it('유효한 이메일과 비밀번호를 통과해야 합니다.', () => {
      const result = loginSchema.safeParse({
        email: 'trader@irontrader.com',
        password: 'secret',
      });

      expect(result.success).toBe(true);
    });

    it('잘못된 이메일 형식을 거부해야 합니다.', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'secret',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toMatch(/이메일/i);
      }
    });

    it('빈 비밀번호를 거부해야 합니다.', () => {
      const result = loginSchema.safeParse({
        email: 'trader@irontrader.com',
        password: '',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('유효한 회원가입 데이터를 통과해야 합니다.', () => {
      const result = registerSchema.safeParse({
        email: 'trader@irontrader.com',
        password: 'Test1234',
        confirmPassword: 'Test1234',
      });

      expect(result.success).toBe(true);
    });

    it('약한 비밀번호를 거부해야 합니다.', () => {
      const result = registerSchema.safeParse({
        email: 'trader@irontrader.com',
        password: 'weak',
        confirmPassword: 'weak',
      });

      expect(result.success).toBe(false);
    });

    it('비밀번호 불일치를 거부해야 합니다.', () => {
      const result = registerSchema.safeParse({
        email: 'trader@irontrader.com',
        password: 'Test1234',
        confirmPassword: 'Test5678',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.some((e) => e.message.includes('일치'))).toBe(true);
      }
    });
  });
});
