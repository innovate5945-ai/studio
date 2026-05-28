// @file src/__tests__/review-journal-list.test.tsx
import { render, screen, within } from '@testing-library/react';
import { ReviewJournalList } from '@/components/reviews/review-journal-list';
import { getReviewJournals, formatDailyReturn } from '@/lib/review-fixtures';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

/**
 * @fileOverview [UI-REVIEW-001] ReviewJournalList 테스트 — 전체 카드 필수 필드 검증
 */
describe('ReviewJournalList', () => {
  it('날짜 내림차순으로 카드를 렌더링해야 합니다.', () => {
    render(<ReviewJournalList />);

    const cards = screen.getAllByTestId(/^review-journal-card-/);
    expect(cards[0]).toHaveAttribute('data-testid', 'review-journal-card-2024-10-24');
    expect(cards.at(-1)).toHaveAttribute('data-testid', 'review-journal-card-2024-10-18');
  });

  it('모든 카드에 당일 수익률·규율 위반 키워드·AI 한줄평이 누락 없이 표시되어야 합니다.', () => {
    render(<ReviewJournalList />);

    getReviewJournals().forEach((entry) => {
      const card = screen.getByTestId(`review-journal-card-${entry.id}`);

      expect(within(card).getByTestId(`review-return-${entry.id}`)).toHaveTextContent(
        formatDailyReturn(entry.dailyReturnPercent)
      );
      expect(within(card).getByTestId(`review-violations-${entry.id}`)).toHaveTextContent(
        /주요 규율 위반 키워드/i
      );
      expect(within(card).getByTestId(`review-ai-summary-${entry.id}`)).toHaveTextContent(
        entry.aiSummary
      );
    });
  });

  it('entries prop으로 필터된 목록만 렌더링해야 합니다.', () => {
    const subset = getReviewJournals().slice(0, 2);
    render(<ReviewJournalList entries={subset} />);

    expect(screen.getAllByTestId(/^review-journal-card-/)).toHaveLength(2);
    expect(screen.queryByTestId('review-journal-card-2024-10-18')).not.toBeInTheDocument();
  });
});
