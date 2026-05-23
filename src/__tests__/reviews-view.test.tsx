import { render, screen, within, fireEvent } from '@testing-library/react';
import { ReviewsView } from '@/components/reviews/reviews-view';
import { getReviewJournals } from '@/lib/review-fixtures';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

/**
 * @fileOverview [UI-REVIEW-001] ReviewsView 통합 테스트
 */
describe('ReviewsView', () => {
  it('날짜별 복기 일지 카드 리스트를 렌더링해야 합니다.', () => {
    render(<ReviewsView />);

    expect(screen.getByTestId('reviews-view')).toBeInTheDocument();
    expect(screen.getByTestId('review-journal-list')).toBeInTheDocument();
    expect(screen.getAllByTestId(/^review-journal-card-/)).toHaveLength(5);
  });

  it('각 카드에 당일 수익률, 규율 위반 키워드, AI 한줄평이 표시되어야 합니다.', () => {
    render(<ReviewsView />);

    const firstCard = screen.getByTestId('review-journal-card-2024-10-24');
    expect(within(firstCard).getByText(/당일 수익률/i)).toBeInTheDocument();
    expect(within(firstCard).getByText('+2.4%')).toBeInTheDocument();
    expect(within(firstCard).getByText(/주요 규율 위반 키워드/i)).toBeInTheDocument();
    expect(within(firstCard).getByText(/AI 한줄평/i)).toBeInTheDocument();
    expect(within(firstCard).getByText(/오후장 추격 매수/i)).toBeInTheDocument();
  });

  it('가장 최근 날짜 일지가 먼저 표시되어야 합니다.', () => {
    render(<ReviewsView />);

    const cards = screen.getAllByTestId(/^review-journal-card-/);
    expect(cards[0]).toHaveAttribute('data-testid', 'review-journal-card-2024-10-24');
  });

  it('검색어에 따라 카드 목록을 필터링해야 합니다.', () => {
    render(<ReviewsView />);

    fireEvent.change(screen.getByTestId('review-search-input'), {
      target: { value: 'Revenge Trade' },
    });

    expect(screen.getAllByTestId(/^review-journal-card-/)).toHaveLength(1);
    expect(screen.getByTestId('review-journal-card-2024-10-23')).toBeInTheDocument();
  });

  it('검색 결과가 없으면 empty state를 표시해야 합니다.', () => {
    render(<ReviewsView />);

    fireEvent.change(screen.getByTestId('review-search-input'), {
      target: { value: 'zzzz-not-found' },
    });

    expect(screen.getByTestId('review-empty-state')).toBeInTheDocument();
  });

  it('모든 일지 카드에 3분 스캔용 핵심 요약 정보가 누락 없이 표시되어야 합니다.', () => {
    render(<ReviewsView />);

    getReviewJournals().forEach((entry) => {
      const card = screen.getByTestId(`review-journal-card-${entry.id}`);
      expect(within(card).getByText(/당일 수익률/i)).toBeInTheDocument();
      expect(within(card).getByText(/주요 규율 위반 키워드/i)).toBeInTheDocument();
      expect(within(card).getByText(/AI 한줄평/i)).toBeInTheDocument();
      expect(within(card).getByTestId(`review-ai-summary-${entry.id}`)).toHaveTextContent(
        entry.aiSummary
      );
    });
  });
});
