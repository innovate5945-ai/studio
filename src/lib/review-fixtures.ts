// @file src/lib/review-fixtures.ts
/**
 * @overview [UI-REVIEW-001] 복기 일지 목록 mock 데이터.
 * @call-flow ReviewsView → getReviewJournals() → ReviewJournalList → ReviewJournalCard
 */
export type ReviewJournalEntry = {
  id: string;
  date: string;
  dateLabel: string;
  dailyReturnPercent: number;
  violationKeywords: string[];
  aiSummary: string;
  tradeCount: number;
  scanMinutes: number;
};

const REVIEW_JOURNALS: ReviewJournalEntry[] = [
  {
    id: '2024-10-24',
    date: '2024-10-24',
    dateLabel: '2024.10.24 (목)',
    dailyReturnPercent: 2.4,
    violationKeywords: ['FOMO', 'Overtrade'],
    aiSummary: '오후장 추격 매수 비중이 높아 수익률 변동성이 컸습니다. 내일은 14시 이후 신규 진입을 2회로 제한하세요.',
    tradeCount: 8,
    scanMinutes: 2,
  },
  {
    id: '2024-10-23',
    date: '2024-10-23',
    dateLabel: '2024.10.23 (수)',
    dailyReturnPercent: -1.8,
    violationKeywords: ['Revenge Trade', 'Loss Limit'],
    aiSummary: '연속 손실 후 포지션 크기를 키운 패턴이 감지되었습니다. cooldown 규칙 준수가 필요합니다.',
    tradeCount: 12,
    scanMinutes: 3,
  },
  {
    id: '2024-10-22',
    date: '2024-10-22',
    dateLabel: '2024.10.22 (화)',
    dailyReturnPercent: 0.6,
    violationKeywords: ['Late Entry'],
    aiSummary: '진입 타이밍은 양호했으나 익절이 너무 이르게 이루어졌습니다. R:R 목표를 1.5 이상으로 유지하세요.',
    tradeCount: 5,
    scanMinutes: 2,
  },
  {
    id: '2024-10-21',
    date: '2024-10-21',
    dateLabel: '2024.10.21 (월)',
    dailyReturnPercent: 3.1,
    violationKeywords: [],
    aiSummary: '규율 준수율 100%의 모범 세션입니다. 동일한 진입 필터를 다음 주에도 유지하세요.',
    tradeCount: 6,
    scanMinutes: 2,
  },
  {
    id: '2024-10-18',
    date: '2024-10-18',
    dateLabel: '2024.10.18 (금)',
    dailyReturnPercent: -0.9,
    violationKeywords: ['Trade Cap', 'Impulsive'],
    aiSummary: '금요일 마감 전 매매 횟수가 상한에 근접했습니다. 주말 전 포지션 정리 규칙을 점검하세요.',
    tradeCount: 9,
    scanMinutes: 3,
  },
];

export function getReviewJournals(): ReviewJournalEntry[] {
  return [...REVIEW_JOURNALS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function formatDailyReturn(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}

export function getReturnTone(value: number): 'positive' | 'negative' | 'neutral' {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}
