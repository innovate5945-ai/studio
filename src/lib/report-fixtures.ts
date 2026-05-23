export type ReportType = 'weekly' | 'monthly';

export type ReportCardItem = {
  id: string;
  title: string;
  periodLabel: string;
  dateRange: string;
  winRate: number;
  netPnl: number;
  tradeCount: number;
  disciplineScore: number;
  status: 'verified' | 'draft';
  highlight: string;
};

export type ReportDetail = {
  type: ReportType;
  typeLabel: string;
  periodCaption: string;
  summaryTitle: string;
  analysisParagraphs: string[];
  keyInsights: string[];
  cards: ReportCardItem[];
};

export const REPORT_TYPE_OPTIONS = [
  { value: 'weekly' as const, label: '주간 리포트' },
  { value: 'monthly' as const, label: '월간 리포트' },
];

const WEEKLY_REPORT: ReportDetail = {
  type: 'weekly',
  typeLabel: '주간 리포트',
  periodCaption: '최근 4주간 주간 단위 성과 요약',
  summaryTitle: '주간 트레이딩 리포트 분석',
  analysisParagraphs: [
    '최근 4주간 평균 승률은 59.2%로, 전주 대비 2.1%p 상승했습니다. 수익 구간은 3주차에 집중되었으며, 2주차의 연속 손실 이후 리스크 관리 규칙이 효과적으로 작동한 것으로 보입니다.',
    '주간 최대 MDD는 4.6%로 alert-settings 임계값 이내를 유지했습니다. 다만 금요일 세션에서 매매 횟수가 급증(12회)하여 trade cap 근접 알림이 1회 발생했습니다.',
    '다음 주에는 오전 세션의 승률(68%)이 오후(51%)보다 높으므로, 오후 시간대 진입 빈도를 줄이는 전략을 권장합니다.',
  ],
  keyInsights: [
    '주간 평균 승률 59.2% · 전주 대비 +2.1%p',
    '주간 순손익 합계 5,600,000원',
    '규율 점수 평균 82점 · trade cap 경고 1회',
  ],
  cards: [
    {
      id: 'w-4',
      title: '4주차 리포트',
      periodLabel: 'Week 4',
      dateRange: '10/21 – 10/27',
      winRate: 62.5,
      netPnl: 1600000,
      tradeCount: 26,
      disciplineScore: 86,
      status: 'verified',
      highlight: 'Profit factor 2.4 · MDD 2.8%',
    },
    {
      id: 'w-3',
      title: '3주차 리포트',
      periodLabel: 'Week 3',
      dateRange: '10/14 – 10/20',
      winRate: 64.0,
      netPnl: 3400000,
      tradeCount: 22,
      disciplineScore: 88,
      status: 'verified',
      highlight: '최고 수익 주 · 승률 64%',
    },
    {
      id: 'w-2',
      title: '2주차 리포트',
      periodLabel: 'Week 2',
      dateRange: '10/07 – 10/13',
      winRate: 52.3,
      netPnl: -600000,
      tradeCount: 30,
      disciplineScore: 71,
      status: 'verified',
      highlight: '연속 손실 구간 · cooldown 1회',
    },
    {
      id: 'w-1',
      title: '1주차 리포트',
      periodLabel: 'Week 1',
      dateRange: '09/30 – 10/06',
      winRate: 58.1,
      netPnl: 1200000,
      tradeCount: 25,
      disciplineScore: 79,
      status: 'draft',
      highlight: '시즌 시작 · 안정적 진입',
    },
  ],
};

const MONTHLY_REPORT: ReportDetail = {
  type: 'monthly',
  typeLabel: '월간 리포트',
  periodCaption: '최근 3개월 월간 단위 성과 요약',
  summaryTitle: '월간 트레이딩 리포트 분석',
  analysisParagraphs: [
    '3개월 누적 순손익은 9,420,000원이며, 월평균 승률 60.1%를 기록했습니다. 10월에 최대 낙폭(6.2%)이 발생했으나, 월말 회복세로 MDD를 4.1%까지 축소했습니다.',
    '월간 매매 횟수는 274회로 trade cap 대비 여유가 있었으나, 10월 2주차에 일일 상한 도달이 2회 기록되어 심리적 매매 편향 가능성이 확인되었습니다.',
    '장기적으로 BTC/ETH 페어의 승률(63%)이 개별 종목(55%)보다 높아, 월간 포트폴리오 비중 조정을 통해 기대 수익률 개선 여지가 있습니다.',
  ],
  keyInsights: [
    '3개월 누적 순손익 9,420,000원',
    '월평균 승률 60.1% · 최대 MDD 6.2%',
    '월간 총 매매 274회 · 규율 점수 84점',
  ],
  cards: [
    {
      id: 'm-10',
      title: '10월 리포트',
      periodLabel: 'October',
      dateRange: '2024-10-01 – 10-31',
      winRate: 58.7,
      netPnl: 3850000,
      tradeCount: 92,
      disciplineScore: 84,
      status: 'verified',
      highlight: 'MDD 6.2% · 회복세 양호',
    },
    {
      id: 'm-9',
      title: '9월 리포트',
      periodLabel: 'September',
      dateRange: '2024-09-01 – 09-30',
      winRate: 61.2,
      netPnl: 3120000,
      tradeCount: 88,
      disciplineScore: 86,
      status: 'verified',
      highlight: '안정적 수익 · trade cap 0회',
    },
    {
      id: 'm-8',
      title: '8월 리포트',
      periodLabel: 'August',
      dateRange: '2024-08-01 – 08-31',
      winRate: 60.4,
      netPnl: 2450000,
      tradeCount: 94,
      disciplineScore: 81,
      status: 'verified',
      highlight: '변동성 확대 · 승률 유지',
    },
  ],
};

const REPORT_FIXTURES: Record<ReportType, ReportDetail> = {
  weekly: WEEKLY_REPORT,
  monthly: MONTHLY_REPORT,
};

export function getReportData(type: ReportType): ReportDetail {
  return REPORT_FIXTURES[type];
}

export function formatReportPnl(value: number): string {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${new Intl.NumberFormat('ko-KR').format(value)}원`;
}

export function formatReportWinRate(value: number): string {
  return `${value.toFixed(1)}%`;
}
