// @file src/lib/dashboard-fixtures.ts
/**
 * @overview [UI-DASH-001] 대시보드 차트 mock 데이터·포맷 헬퍼.
 * @call-flow DashboardAnalytics → getDashboardData(period) → SummaryMetric + charts
 */
export type DashboardPeriod = '1w' | '1m' | '3m';

export type MddDataPoint = {
  label: string;
  value: number;
};

export type TradeDataPoint = {
  label: string;
  value: number;
};

export type DashboardFixture = {
  period: DashboardPeriod;
  periodLabel: string;
  winRate: number;
  winCount: number;
  lossCount: number;
  netPnl: number;
  maxMdd: number;
  totalTrades: number;
  mddSeries: MddDataPoint[];
  tradeSeries: TradeDataPoint[];
};

export const DASHBOARD_PERIOD_OPTIONS = [
  { value: '1w' as const, label: '1주일' },
  { value: '1m' as const, label: '1개월' },
  { value: '3m' as const, label: '3개월' },
];

const DASHBOARD_FIXTURES: Record<DashboardPeriod, DashboardFixture> = {
  '1w': {
    period: '1w',
    periodLabel: '1주일',
    winRate: 64.2,
    winCount: 16,
    lossCount: 9,
    netPnl: 1240000,
    maxMdd: 2.8,
    totalTrades: 25,
    mddSeries: [
      { label: '월', value: 1.2 },
      { label: '화', value: 2.1 },
      { label: '수', value: 0.8 },
      { label: '목', value: 1.5 },
      { label: '금', value: 2.8 },
      { label: '토', value: 2.8 },
      { label: '일', value: 0.5 },
    ],
    tradeSeries: [
      { label: '월', value: 5 },
      { label: '화', value: 8 },
      { label: '수', value: 3 },
      { label: '목', value: 12 },
      { label: '금', value: 6 },
      { label: '토', value: 0 },
      { label: '일', value: 2 },
    ],
  },
  '1m': {
    period: '1m',
    periodLabel: '1개월',
    winRate: 58.7,
    winCount: 54,
    lossCount: 38,
    netPnl: 3850000,
    maxMdd: 4.6,
    totalTrades: 92,
    mddSeries: [
      { label: '1주', value: 1.8 },
      { label: '2주', value: 3.2 },
      { label: '3주', value: 2.4 },
      { label: '4주', value: 4.6 },
    ],
    tradeSeries: [
      { label: '1주', value: 18 },
      { label: '2주', value: 26 },
      { label: '3주', value: 22 },
      { label: '4주', value: 26 },
    ],
  },
  '3m': {
    period: '3m',
    periodLabel: '3개월',
    winRate: 61.4,
    winCount: 168,
    lossCount: 106,
    netPnl: 9420000,
    maxMdd: 6.2,
    totalTrades: 274,
    mddSeries: [
      { label: '1월', value: 2.5 },
      { label: '2월', value: 4.1 },
      { label: '3월', value: 6.2 },
    ],
    tradeSeries: [
      { label: '1월', value: 82 },
      { label: '2월', value: 96 },
      { label: '3월', value: 96 },
    ],
  },
};

export function getDashboardData(period: DashboardPeriod): DashboardFixture {
  return DASHBOARD_FIXTURES[period];
}

export function formatKrw(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

export function formatWinRate(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatMdd(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatTradeCount(value: number): string {
  return `${value}회`;
}
