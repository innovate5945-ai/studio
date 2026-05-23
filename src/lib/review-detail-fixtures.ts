import {
  getReviewJournals,
  type ReviewJournalEntry,
} from '@/lib/review-fixtures';

export type TimelineTradePoint = {
  time: string;
  cumulativePnl: number;
  tradeLabel?: string;
  eventType?: 'entry' | 'exit' | 'win' | 'loss';
};

export type InsightSection = {
  title: string;
  body: string;
};

export type ReviewJournalDetail = ReviewJournalEntry & {
  timeline: TimelineTradePoint[];
  aiDeepAnalysis: {
    headline: string;
    psychologySummary: string;
    insightSections: InsightSection[];
    actionItems: string[];
  };
};

const DETAIL_EXTENSIONS: Record<
  string,
  Pick<ReviewJournalDetail, 'timeline' | 'aiDeepAnalysis'>
> = {
  '2024-10-24': {
    timeline: [
      { time: '09:30', cumulativePnl: 0, tradeLabel: 'Session Open' },
      { time: '10:15', cumulativePnl: 120000, tradeLabel: 'BTC Long +1.2%', eventType: 'win' },
      { time: '11:40', cumulativePnl: 80000, tradeLabel: 'ETH Exit', eventType: 'exit' },
      { time: '14:05', cumulativePnl: 210000, tradeLabel: 'AAPL FOMO Entry', eventType: 'entry' },
      { time: '14:50', cumulativePnl: 140000, tradeLabel: 'AAPL Stop', eventType: 'loss' },
      { time: '15:30', cumulativePnl: 240000, tradeLabel: 'Close Session', eventType: 'exit' },
    ],
    aiDeepAnalysis: {
      headline: '오후장 FOMO 진입이 수익 곡선을 훼손했습니다',
      psychologySummary:
        '오전 세션에서는 계획된 진입과 손절 준수가 뚜렷했으나, 14시 이후 승률 하락 구간에서 "놓치는 것에 대한 불안(FOMO)"이 두드러졌습니다. 특히 14:05 AAPL 추격 매수는 손실 직후 감정 회복 욕구와 결합되어 리스크 대비 기대수익(R:R)이 1:0.8로 악화되었습니다.',
      insightSections: [
        {
          title: '매매 심리 패턴',
          body: '연속 2회 익절 이후 자신감 과잉(Overconfidence)이 관찰되었고, 이후 손실 포지션에서 포지션 크기를 1.3배 확대했습니다. 이는 전형적인 "Hot Hand Fallacy" 패턴입니다.',
        },
        {
          title: '타임라인 분석',
          body: '10:15~11:40 구간의 에쿼티 곡선은 완만한 우상향이었으나, 14:05 이후 변동성이 급증했습니다. 오후장 매매 3회 중 2회가 손실로 마감되어 당일 수익률의 40%를 반납했습니다.',
        },
        {
          title: '규율 위반 상관관계',
          body: 'FOMO·Overtrade 키워드는 14시 이후 거래와 100% 일치합니다. alert-settings trade cap에는 도달하지 않았으나, "시간대별 진입 상한" 규칙 도입을 권장합니다.',
        },
      ],
      actionItems: [
        '14:00 이후 신규 진입을 2회로 제한',
        '손실 직후 15분 cooldown 의무화',
        '오전 세션 진입 필터를 오후에도 동일 적용',
      ],
    },
  },
  '2024-10-23': {
    timeline: [
      { time: '09:45', cumulativePnl: 0 },
      { time: '10:30', cumulativePnl: -80000, tradeLabel: 'Revenge #1', eventType: 'loss' },
      { time: '11:15', cumulativePnl: -160000, tradeLabel: 'Revenge #2', eventType: 'loss' },
      { time: '13:00', cumulativePnl: -120000, tradeLabel: 'Partial Recovery', eventType: 'win' },
      { time: '15:20', cumulativePnl: -180000, tradeLabel: 'Loss Limit Touch', eventType: 'loss' },
    ],
    aiDeepAnalysis: {
      headline: 'Revenge Trading 연쇄 반응이 당일 손실을 확대했습니다',
      psychologySummary:
        '첫 손실(10:30) 직후 45분 내 재진입은 "손실 만회(Revenge)" 심리가 지배적이었습니다. 감정적 회복 욕구가 리스크 관리 규칙을 압도하여 loss limit 경고가 발생했습니다.',
      insightSections: [
        {
          title: '매매 심리 패턴',
          body: '손실 후 30분 이내 재진입률 100%, 평균 포지션 크기 +35%. 전형적인 Revenge Trade 및 Loss Aversion 회피 패턴입니다.',
        },
        {
          title: '타임라인 분석',
          body: '10:30~11:15 구간에서 연속 손실이 누적되며 MDD가 급격히 확대되었습니다. 13:00 일시 반등 후 15:20에 다시 하락하여 V자 회복에 실패했습니다.',
        },
        {
          title: '규율 위반 상관관계',
          body: 'Loss Limit 위반 직전 12회 매매 중 8회가 손실 세션 이후에 집중되었습니다. cooldown 배너 발동이 권장되는 구간입니다.',
        },
      ],
      actionItems: [
        '첫 손실 후 30분 mandatory cooldown',
        '연속 2손실 시 당일 세션 종료',
        'Revenge Trade 감지 시 Fact-Bomb 자동 트리거',
      ],
    },
  },
  '2024-10-22': {
    timeline: [
      { time: '10:00', cumulativePnl: 0 },
      { time: '11:30', cumulativePnl: 60000, tradeLabel: 'Clean Entry', eventType: 'win' },
      { time: '14:00', cumulativePnl: 90000, tradeLabel: 'Early Exit', eventType: 'exit' },
      { time: '15:45', cumulativePnl: 60000, tradeLabel: 'Late Entry', eventType: 'entry' },
    ],
    aiDeepAnalysis: {
      headline: '양호한 진입, 보수적 조기 익절이 기회비용을 발생시켰습니다',
      psychologySummary:
        '진입 품질은 우수했으나 "수익 보호" 심리로 R:R 목표(1.5) 도달 전 조기 청산이 반복되었습니다. Late Entry 1건은 장 마감 전 불안감에서 기인했습니다.',
      insightSections: [
        {
          title: '매매 심리 패턴',
          body: 'Profit Protection Bias — 작은 수익 확정에 집착하여 MFE 대비 60% 수준에서만 익절했습니다.',
        },
        {
          title: '타임라인 분석',
          body: '11:30 진입 후 최대 +1.2%까지 도달했으나 +0.6%에서 청산. 14:00~15:45 구간은 횡보 후 불필요한 진입 1회.',
        },
        {
          title: '규율 위반 상관관계',
          body: 'Late Entry 1건만 규율 위반. 전반적 규율 준수율 85%로 양호하나 익절 규칙 재점검이 필요합니다.',
        },
      ],
      actionItems: [
        'MFE 70% 도달 전 조기 익절 금지',
        'R:R 1.5 미달 시 진입 보류',
        '장 마감 30분 전 신규 진입 금지',
      ],
    },
  },
  '2024-10-21': {
    timeline: [
      { time: '09:30', cumulativePnl: 0 },
      { time: '10:45', cumulativePnl: 150000, eventType: 'win' },
      { time: '12:00', cumulativePnl: 280000, eventType: 'win' },
      { time: '14:30', cumulativePnl: 310000, eventType: 'win' },
    ],
    aiDeepAnalysis: {
      headline: '모범적인 규율 준수 세션 — 패턴을 반복하세요',
      psychologySummary:
        '감정적 동요 없이 사전 정의된 진입·청산 규칙을 일관되게 따랐습니다. Overconfidence 징후 없이 포지션 크기를 일정하게 유지했습니다.',
      insightSections: [
        {
          title: '매매 심리 패턴',
          body: 'Neutral~Disciplined 상태 유지. FOMO·Revenge·Impulsive 패턴 미감지. 심리적 에너지 소모가 낮은 "Flow State"에 가까운 세션.',
        },
        {
          title: '타임라인 분석',
          body: '완만한 우상향 곡선. 3회 매매 모두 계획된 시간대(10~15시) 내 실행. MDD 0.3%로 최소.',
        },
        {
          title: '규율 위반 상관관계',
          body: '위반 0건. alert-settings 모든 임계값 이내. 이 세션의 진입 체크리스트를 템플릿으로 저장 권장.',
        },
      ],
      actionItems: [
        '현재 진입 필터를 기본 템플릿으로 저장',
        '동일 시간대·동일 R:R 규칙 유지',
        '주간 복기 시 이 세션을 벤치마크로 사용',
      ],
    },
  },
  '2024-10-18': {
    timeline: [
      { time: '09:30', cumulativePnl: 0 },
      { time: '11:00', cumulativePnl: -40000, eventType: 'loss' },
      { time: '13:30', cumulativePnl: -70000, eventType: 'loss' },
      { time: '15:00', cumulativePnl: -90000, tradeLabel: 'Trade Cap Near', eventType: 'entry' },
    ],
    aiDeepAnalysis: {
      headline: '금요일 마감 전 Impulsive 매매가 trade cap에 근접했습니다',
      psychologySummary:
        '주말 전 포지션 정리 압박과 "오늘 만회" 심리가 결합되어 15:00에 불필요한 9번째 매매가 발생했습니다. Impulsive·Trade Cap 키워드와 일치합니다.',
      insightSections: [
        {
          title: '매매 심리 패턴',
          body: 'Weekend Effect — 금요일 오후 Impulsive 진입 빈도가 타 요일 대비 2.1배. 마감 전 불안(End-of-Week Anxiety) 패턴.',
        },
        {
          title: '타임라인 분석',
          body: '11:00~13:30 연속 소폭 손실 후 15:00 급진입. 당일 9회 매매로 trade cap(10회) 90% 소진.',
        },
        {
          title: '규율 위반 상관관계',
          body: 'Trade Cap·Impulsive 동시 발생. 금요일 14:00 이후 진입 금지 규칙 도입을 강력 권장.',
        },
      ],
      actionItems: [
        '금요일 14:00 이후 신규 진입 금지',
        'Trade cap 80% 도달 시 세션 자동 종료',
        '주말 전 포지션 정리 체크리스트 작성',
      ],
    },
  },
};

export function getReviewJournalById(id: string): ReviewJournalDetail | null {
  const base = getReviewJournals().find((entry) => entry.id === id);
  if (!base) return null;

  const extension = DETAIL_EXTENSIONS[id];
  if (!extension) return null;

  return { ...base, ...extension };
}

export function formatTimelinePnl(value: number): string {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${new Intl.NumberFormat('ko-KR').format(value)}원`;
}
