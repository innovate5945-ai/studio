// @file src/__tests__/login-form.test.tsx
/**
 * @overview [UI-AUTH-001] login-form.test.tsx — LoginForm 단위/통합 테스트.
 *
 * @call-flow
 * 1. render/mount LoginForm
 * 2. assert UI states + interactions
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/login-form';
import { loginUser } from '@/actions/auth';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({ toast: jest.fn() })),
}));

jest.mock('@/actions/auth', () => ({
  loginUser: jest.fn(),
}));

const mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;


describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoginUser.mockResolvedValue({ success: true, message: '로그인되었습니다.' });
  });

  it('이메일·비밀번호 필드와 로그인 버튼을 렌더링해야 합니다.', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/이메일 입력/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호 입력/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument();
  });

  it('잘못된 이메일 입력 시 실시간 에러를 표시해야 합니다.', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/이메일 입력/i), {
      target: { value: 'invalid-email' },
    });

    await waitFor(() => {
      expect(screen.getByText(/올바른 이메일 형식이 아닙니다/i)).toBeInTheDocument();
    });
  });

  it('유효하지 않을 때 로그인 버튼이 비활성화되어야 합니다.', () => {
    render(<LoginForm />);
    expect(screen.getByRole('button', { name: /로그인/i })).toBeDisabled();
  });

  it('유효한 입력 시 Server Action을 호출해야 합니다.', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/이메일 입력/i), {
      target: { value: 'trader@irontrader.com' },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호 입력/i), {
      target: { value: 'mypassword' },
    });

    const submitButton = screen.getByRole('button', { name: /로그인/i });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith({
        email: 'trader@irontrader.com',
        password: 'mypassword',
      });
    });
  });

  it('회원가입 링크를 표시해야 합니다.', () => {
    render(<LoginForm />);
    expect(screen.getByRole('link', { name: /회원가입/i })).toHaveAttribute('href', '/register');
  });

  it('모바일 터치 타겟을 위해 입력과 버튼에 충분한 높이 클래스를 적용해야 합니다.', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/이메일 입력/i)).toHaveClass('h-12');
    expect(screen.getByLabelText(/비밀번호 입력/i)).toHaveClass('h-12');
    expect(screen.getByRole('button', { name: /로그인/i })).toHaveClass('h-12', 'w-full');
  });
});
