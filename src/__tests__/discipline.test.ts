import {
  evaluateDisciplineBreach,
  formatCooldownTime,
  getRemainingSeconds,
} from '@/lib/discipline';

describe('discipline utilities', () => {
  describe('evaluateDisciplineBreach', () => {
    it('손실 한도 초과 시 loss_limit 위반을 반환해야 합니다.', () => {
      const breach = evaluateDisciplineBreach(
        { dailyLossPercent: 6, tradeCount: 2 },
        { lossLimit: 5, tradeCap: 10 }
      );

      expect(breach).toEqual({
        breachType: 'loss_limit',
        reason: '당일 손실 6%가 설정 한도 5%를 초과했습니다.',
      });
    });

    it('매매 횟수 상한 도달 시 trade_cap 위반을 반환해야 합니다.', () => {
      const breach = evaluateDisciplineBreach(
        { dailyLossPercent: 2, tradeCount: 5 },
        { lossLimit: 5, tradeCap: 5 }
      );

      expect(breach).toEqual({
        breachType: 'trade_cap',
        reason: '당일 매매 5회가 설정 상한 5회에 도달했습니다.',
      });
    });

    it('임계값 미만이면 null을 반환해야 합니다.', () => {
      const breach = evaluateDisciplineBreach(
        { dailyLossPercent: 3, tradeCount: 2 },
        { lossLimit: 5, tradeCap: 5 }
      );

      expect(breach).toBeNull();
    });

    it('손실과 매매 모두 초과 시 손실 한도를 우선해야 합니다.', () => {
      const breach = evaluateDisciplineBreach(
        { dailyLossPercent: 8, tradeCount: 10 },
        { lossLimit: 5, tradeCap: 5 }
      );

      expect(breach?.breachType).toBe('loss_limit');
    });
  });

  describe('formatCooldownTime', () => {
    it('초를 mm:ss 형식으로 포맷해야 합니다.', () => {
      expect(formatCooldownTime(90)).toBe('1:30');
      expect(formatCooldownTime(5)).toBe('0:05');
      expect(formatCooldownTime(1800)).toBe('30:00');
    });
  });

  describe('getRemainingSeconds', () => {
    it('endsAt이 null이면 0을 반환해야 합니다.', () => {
      expect(getRemainingSeconds(null)).toBe(0);
    });

    it('남은 시간을 초 단위로 반환해야 합니다.', () => {
      const endsAt = Date.now() + 5000;
      const remaining = getRemainingSeconds(endsAt);
      expect(remaining).toBeGreaterThanOrEqual(4);
      expect(remaining).toBeLessThanOrEqual(5);
    });
  });
});
