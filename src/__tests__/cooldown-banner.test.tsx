// @file src/__tests__/cooldown-banner.test.tsx
import { render, screen } from '@testing-library/react';
import { CooldownBanner } from '@/components/dashboard/cooldown-banner';
import { useDiscipline } from '@/contexts/discipline-provider';

jest.mock('@/contexts/discipline-provider', () => ({
  useDiscipline: jest.fn(),
}));

const mockUseDiscipline = useDiscipline as jest.MockedFunction<typeof useDiscipline>;

/**
 * @fileOverview [UI-ALERT-002] CooldownBanner 테스트
 */
describe('CooldownBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('쿨타임이 비활성일 때 배너를 렌더링하지 않아야 합니다.', () => {
    mockUseDiscipline.mockReturnValue({
      cooldown: { active: false, endsAt: null, breachType: null, reason: '' },
      timeLeft: 0,
    } as ReturnType<typeof useDiscipline>);

    const { container } = render(<CooldownBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('쿨타임 활성 시 배너와 타이머를 표시해야 합니다.', () => {
    mockUseDiscipline.mockReturnValue({
      cooldown: {
        active: true,
        endsAt: Date.now() + 90000,
        breachType: 'trade_cap',
        reason: '당일 매매 5회가 설정 상한 5회에 도달했습니다.',
      },
      timeLeft: 90,
    } as ReturnType<typeof useDiscipline>);

    render(<CooldownBanner />);

    expect(screen.getByText(/Discipline Breach: Mandatory Cooldown Active/i)).toBeInTheDocument();
    expect(screen.getByText(/매매 횟수 상한 도달/i)).toBeInTheDocument();
    expect(screen.getByText('1:30')).toBeInTheDocument();
  });

  it('손실 한도 위반 시 해당 라벨을 표시해야 합니다.', () => {
    mockUseDiscipline.mockReturnValue({
      cooldown: {
        active: true,
        endsAt: Date.now() + 60000,
        breachType: 'loss_limit',
        reason: '당일 손실 6%가 설정 한도 5%를 초과했습니다.',
      },
      timeLeft: 60,
    } as ReturnType<typeof useDiscipline>);

    render(<CooldownBanner />);

    expect(screen.getByText(/손실 한도 초과/i)).toBeInTheDocument();
    expect(screen.getByText('1:00')).toBeInTheDocument();
  });
});
