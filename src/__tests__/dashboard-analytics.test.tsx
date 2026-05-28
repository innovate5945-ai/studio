// @file src/__tests__/dashboard-analytics.test.tsx
/**
 * @overview [UI-DASH-001] dashboard-analytics.test.tsx — DashboardAnalytics 단위/통합 테스트.
 *
 * @call-flow
 * 1. render/mount DashboardAnalytics
 * 2. assert UI states + interactions
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardAnalytics } from '@/components/dashboard/dashboard-analytics';

jest.mock('recharts', () => {
  const React = require('react');
  return {
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    PieChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="pie-chart">{children}</div>
    ),
    Pie: () => null,
    Cell: () => null,
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="line-chart">{children}</div>
    ),
    Line: () => null,
    BarChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="bar-chart">{children}</div>
    ),
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
  };
});


describe('DashboardAnalytics', () => {
  it('기본 1주일 데이터와 차트 3종을 렌더링해야 합니다.', () => {
    render(<DashboardAnalytics />);

    expect(screen.getByTestId('dashboard-analytics')).toBeInTheDocument();
    expect(screen.getByTestId('win-rate-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mdd-line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('trade-count-chart')).toBeInTheDocument();
    expect(screen.getByTestId('win-rate-value')).toHaveTextContent('64.2%');
    expect(screen.getByTestId('trade-total-value')).toHaveTextContent('25회');
  });

  it('요약 지표에 %, 원, 회 단위를 표시해야 합니다.', () => {
    render(<DashboardAnalytics />);

    expect(screen.getByTestId('summary-win-rate')).toHaveTextContent('%');
    expect(screen.getByTestId('summary-net-pnl')).toHaveTextContent('원');
    expect(screen.getByTestId('summary-max-mdd')).toHaveTextContent('%');
    expect(screen.getByTestId('summary-total-trades')).toHaveTextContent('회');
  });

  it('1개월 필터 클릭 시 차트 데이터가 업데이트되어야 합니다.', () => {
    render(<DashboardAnalytics />);

    fireEvent.click(screen.getByTestId('period-filter-1m'));

    expect(screen.getByTestId('win-rate-value')).toHaveTextContent('58.7%');
    expect(screen.getByTestId('mdd-max-value')).toHaveTextContent('Max 4.6%');
    expect(screen.getByTestId('trade-total-value')).toHaveTextContent('92회');
    expect(screen.getByTestId('summary-net-pnl')).toHaveTextContent('3,850,000');
  });

  it('3개월 필터 클릭 시 차트 데이터가 업데이트되어야 합니다.', () => {
    render(<DashboardAnalytics />);

    fireEvent.click(screen.getByTestId('period-filter-3m'));

    expect(screen.getByTestId('win-rate-value')).toHaveTextContent('61.4%');
    expect(screen.getByTestId('trade-total-value')).toHaveTextContent('274회');
    expect(screen.getByTestId('summary-net-pnl')).toHaveTextContent('9,420,000');
  });
});
