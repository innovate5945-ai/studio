import { getDashboardData, formatKrw } from '@/lib/dashboard-fixtures';

describe('dashboard-fixtures', () => {
  it('1주일 데이터를 반환해야 합니다.', () => {
    const data = getDashboardData('1w');

    expect(data.periodLabel).toBe('1주일');
    expect(data.winRate).toBe(64.2);
    expect(data.mddSeries).toHaveLength(7);
    expect(data.tradeSeries).toHaveLength(7);
  });

  it('1개월 데이터를 반환해야 합니다.', () => {
    const data = getDashboardData('1m');

    expect(data.periodLabel).toBe('1개월');
    expect(data.winRate).toBe(58.7);
    expect(data.totalTrades).toBe(92);
    expect(data.mddSeries).toHaveLength(4);
  });

  it('3개월 데이터를 반환해야 합니다.', () => {
    const data = getDashboardData('3m');

    expect(data.periodLabel).toBe('3개월');
    expect(data.winRate).toBe(61.4);
    expect(data.netPnl).toBe(9420000);
    expect(formatKrw(data.netPnl)).toBe('9,420,000');
  });

  it('기간별로 서로 다른 승률을 제공해야 합니다.', () => {
    const week = getDashboardData('1w');
    const month = getDashboardData('1m');
    const quarter = getDashboardData('3m');

    expect(week.winRate).not.toBe(month.winRate);
    expect(month.totalTrades).not.toBe(quarter.totalTrades);
  });
});
