// @file src/__tests__/review-fixtures.test.ts
/**
 * @overview [UI-REVIEW-001] review-fixtures.test.ts — lib/review-fixtures 단위/통합 테스트.
 *
 * @call-flow
 * 1. render/mount lib/review-fixtures
 * 2. assert UI states + interactions
 */
import { getReviewJournals, formatDailyReturn, getReturnTone } from '@/lib/review-fixtures';

describe('review-fixtures', () => {
  it('복기 일지를 날짜 내림차순으로 정렬해야 합니다.', () => {
    const journals = getReviewJournals();

    expect(journals.length).toBeGreaterThan(0);
    for (let i = 0; i < journals.length - 1; i++) {
      expect(new Date(journals[i].date).getTime()).toBeGreaterThanOrEqual(
        new Date(journals[i + 1].date).getTime()
      );
    }
  });

  it('각 일지에 필수 요약 필드가 포함되어야 합니다.', () => {
    const journals = getReviewJournals();

    journals.forEach((entry) => {
      expect(entry.dailyReturnPercent).toBeDefined();
      expect(Array.isArray(entry.violationKeywords)).toBe(true);
      expect(entry.aiSummary.trim().length).toBeGreaterThan(0);
    });
  });

  it('당일 수익률 포맷에 % 단위를 포함해야 합니다.', () => {
    expect(formatDailyReturn(2.4)).toBe('+2.4%');
    expect(formatDailyReturn(-1.8)).toBe('-1.8%');
  });

  it('수익률 톤을 올바르게 분류해야 합니다.', () => {
    expect(getReturnTone(1.2)).toBe('positive');
    expect(getReturnTone(-0.5)).toBe('negative');
    expect(getReturnTone(0)).toBe('neutral');
  });
});
