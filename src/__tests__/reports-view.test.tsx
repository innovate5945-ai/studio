// @file src/__tests__/reports-view.test.tsx
/**
 * @overview [UI-DASH-002] reports-view.test.tsx — ReportsView 단위/통합 테스트.
 *
 * @call-flow
 * 1. render/mount ReportsView
 * 2. assert UI states + interactions
 */
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ReportsView } from '@/components/reports/reports-view';


describe('ReportsView', () => {
  it('기본 주간 리포트 탭과 카드 리스트를 렌더링해야 합니다.', () => {
    render(<ReportsView />);

    expect(screen.getByTestId('reports-view')).toBeInTheDocument();
    expect(screen.getByTestId('report-tab-weekly')).toHaveAttribute('data-state', 'active');
    expect(screen.getByTestId('report-detail-panel')).toBeInTheDocument();
    expect(screen.getByText(/주간 트레이딩 리포트 분석/i)).toBeInTheDocument();

    const cardList = screen.getByTestId('report-card-list');
    expect(within(cardList).getByTestId('report-card-w-4')).toBeInTheDocument();
    expect(within(cardList).getAllByTestId(/^report-card-w-/)).toHaveLength(4);
  });

  it('주간 리포트 상세 분석 텍스트를 표시해야 합니다.', () => {
    render(<ReportsView />);

    const analysis = screen.getByTestId('report-analysis-text');
    expect(within(analysis).getByText(/최근 4주간 평균 승률은 59\.2%/i)).toBeInTheDocument();
    expect(screen.getByTestId('report-key-insights')).toHaveTextContent('주간 평균 승률 59.2%');
  });

  it('월간 리포트 탭 전환 시 카드와 분석 텍스트가 업데이트되어야 합니다.', () => {
    render(<ReportsView />);

    fireEvent.click(screen.getByTestId('report-tab-monthly'));

    expect(screen.getByText(/월간 트레이딩 리포트 분석/i)).toBeInTheDocument();

    const cardList = screen.getByTestId('report-card-list');
    expect(within(cardList).getByTestId('report-card-m-10')).toBeInTheDocument();
    expect(within(cardList).queryByTestId('report-card-w-4')).not.toBeInTheDocument();
    expect(within(cardList).getAllByTestId(/^report-card-m-/)).toHaveLength(3);

    const analysis = screen.getByTestId('report-analysis-text');
    expect(within(analysis).getByText(/3개월 누적 순손익은 9,420,000원/i)).toBeInTheDocument();
    expect(screen.getByTestId('report-key-insights')).toHaveTextContent('3개월 누적 순손익');
  });

  it('탭 전환 후 헤더 설명이 해당 리포트 유형을 반영해야 합니다.', () => {
    render(<ReportsView />);

    expect(screen.getByText(/주간 리포트 기준/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('report-tab-monthly'));

    expect(screen.getByText(/월간 리포트 기준/i)).toBeInTheDocument();
  });

  it('리포트 카드에 승률·순손익·매매 횟수를 표시해야 합니다.', () => {
    render(<ReportsView />);

    const card = screen.getByTestId('report-card-w-4');
    expect(within(card).getByText('62.5%')).toBeInTheDocument();
    expect(within(card).getByText(/\+1,600,000원/)).toBeInTheDocument();
    expect(within(card).getByText('26회')).toBeInTheDocument();
  });
});
