// @file src/__tests__/review-detail-fixtures.test.ts
import { getReviewJournalById, formatTimelinePnl } from '@/lib/review-detail-fixtures';
import { getReviewJournals } from '@/lib/review-fixtures';

describe('review-detail-fixtures', () => {
  it('유효한 ID로 상세 데이터를 반환해야 합니다.', () => {
    const detail = getReviewJournalById('2024-10-24');

    expect(detail).not.toBeNull();
    expect(detail?.timeline.length).toBeGreaterThan(0);
    expect(detail?.aiDeepAnalysis.headline).toBeTruthy();
    expect(detail?.aiDeepAnalysis.psychologySummary).toBeTruthy();
    expect(detail?.aiDeepAnalysis.insightSections.length).toBeGreaterThanOrEqual(3);
    expect(detail?.aiDeepAnalysis.actionItems.length).toBeGreaterThanOrEqual(1);
  });

  it('존재하지 않는 ID는 null을 반환해야 합니다.', () => {
    expect(getReviewJournalById('invalid-id')).toBeNull();
  });

  it('목록의 모든 일지 ID에 상세 데이터가 있어야 합니다.', () => {
    getReviewJournals().forEach((entry) => {
      expect(getReviewJournalById(entry.id)).not.toBeNull();
    });
  });

  it('타임라인 손익 포맷에 원 단위를 포함해야 합니다.', () => {
    expect(formatTimelinePnl(240000)).toBe('+240,000원');
    expect(formatTimelinePnl(-80000)).toBe('-80,000원');
  });
});
