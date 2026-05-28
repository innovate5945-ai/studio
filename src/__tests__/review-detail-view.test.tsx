// @file src/__tests__/review-detail-view.test.tsx
/**
 * @overview [UI-REVIEW-002] review-detail-view.test.tsx — ReviewDetailView 단위/통합 테스트.
 *
 * @call-flow
 * 1. render/mount ReviewDetailView
 * 2. assert UI states + interactions
 */
import { render, screen, within } from '@testing-library/react';
import { ReviewDetailView } from '@/components/reviews/review-detail-view';
import { getReviewJournalById } from '@/lib/review-detail-fixtures';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  useParams: jest.fn(),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('recharts', () => {
  const React = require('react');
  return {
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="line-chart">{children}</div>
    ),
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    ReferenceDot: () => null,
  };
});

import { useParams } from 'next/navigation';

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;


describe('ReviewDetailView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: '2024-10-24' });
  });

  it('타임라인 차트와 AI 인사이트 패널을 렌더링해야 합니다.', () => {
    render(<ReviewDetailView />);

    expect(screen.getByTestId('review-detail-view')).toBeInTheDocument();
    expect(screen.getByTestId('review-timeline-chart')).toBeInTheDocument();
    expect(screen.getByTestId('review-insights-panel')).toBeInTheDocument();
    expect(screen.getByText(/매매 타임라인/i)).toBeInTheDocument();
    expect(screen.getByText(/인사이트 및 매매 심리 분석/i)).toBeInTheDocument();
  });

  it('AI 심층 분석 헤드라인과 심리 요약을 표시해야 합니다.', () => {
    const detail = getReviewJournalById('2024-10-24')!;
    render(<ReviewDetailView />);

    expect(screen.getByTestId('review-insights-headline')).toHaveTextContent(
      detail.aiDeepAnalysis.headline
    );
    expect(screen.getByTestId('review-psychology-summary')).toHaveTextContent(
      detail.aiDeepAnalysis.psychologySummary
    );
  });

  it('인사이트 섹션과 Action Items를 표시해야 합니다.', () => {
    const detail = getReviewJournalById('2024-10-24')!;
    render(<ReviewDetailView />);

    const sections = screen.getByTestId('review-insight-sections');
    detail.aiDeepAnalysis.insightSections.forEach((section) => {
      expect(within(sections).getByText(section.title)).toBeInTheDocument();
      expect(within(sections).getByText(section.body)).toBeInTheDocument();
    });

    const actions = screen.getByTestId('review-action-items');
    detail.aiDeepAnalysis.actionItems.forEach((item) => {
      expect(within(actions).getByText(item)).toBeInTheDocument();
    });
  });

  it('당일 수익률과 목록 한줄평을 헤더에 표시해야 합니다.', () => {
    const detail = getReviewJournalById('2024-10-24')!;
    render(<ReviewDetailView />);

    expect(screen.getByTestId('review-detail-return')).toHaveTextContent('+2.4%');
    expect(screen.getByText(detail.aiSummary)).toBeInTheDocument();
  });

  it('존재하지 않는 ID는 not found 상태를 표시해야 합니다.', () => {
    mockUseParams.mockReturnValue({ id: 'unknown-date' });
    render(<ReviewDetailView />);

    expect(screen.getByTestId('review-not-found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /목록으로 돌아가기/i })).toHaveAttribute(
      'href',
      '/reviews'
    );
  });
});
