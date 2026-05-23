import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '@/components/auth/register-form';
import { registerUser } from '@/actions/auth';

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
  registerUser: jest.fn(),
}));

const mockRegisterUser = registerUser as jest.MockedFunction<typeof registerUser>;

/**
 * @fileOverview [UI-AUTH-001] RegisterForm 테스트
 */
describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRegisterUser.mockResolvedValue({ success: true, message: '회원가입이 완료되었습니다.' });
  });

  it('이메일·비밀번호·비밀번호 확인 필드를 렌더링해야 합니다.', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/이메일 입력/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^비밀번호 입력$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호 확인 입력/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /회원가입/i })).toBeInTheDocument();
  });

  it('약한 비밀번호 입력 시 실시간 에러를 표시해야 합니다.', async () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/^비밀번호 입력$/i), {
      target: { value: 'weak' },
    });

    await waitFor(() => {
      expect(screen.getByText(/8자 이상/i)).toBeInTheDocument();
    });
  });

  it('비밀번호 불일치 시 실시간 에러를 표시해야 합니다.', async () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/^비밀번호 입력$/i), {
      target: { value: 'Test1234' },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호 확인 입력/i), {
      target: { value: 'Test5678' },
    });

    await waitFor(() => {
      expect(screen.getByText(/비밀번호가 일치하지 않습니다/i)).toBeInTheDocument();
    });
  });

  it('유효한 입력 시 Server Action을 호출해야 합니다.', async () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/이메일 입력/i), {
      target: { value: 'trader@irontrader.com' },
    });
    fireEvent.change(screen.getByLabelText(/^비밀번호 입력$/i), {
      target: { value: 'Test1234' },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호 확인 입력/i), {
      target: { value: 'Test1234' },
    });

    const submitButton = screen.getByRole('button', { name: /회원가입/i });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith({
        email: 'trader@irontrader.com',
        password: 'Test1234',
        confirmPassword: 'Test1234',
      });
    });
  });

  it('로그인 링크를 표시해야 합니다.', () => {
    render(<RegisterForm />);
    expect(screen.getByRole('link', { name: /로그인/i })).toHaveAttribute('href', '/login');
  });

  it('모바일에서 폼 요소가 full-width 레이아웃을 유지해야 합니다.', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/이메일 입력/i)).toHaveClass('w-full');
    expect(screen.getByLabelText(/^비밀번호 입력$/i)).toHaveClass('w-full');
    expect(screen.getByRole('button', { name: /회원가입/i })).toHaveClass('w-full');
  });
});
