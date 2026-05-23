import { render, screen, within } from '@testing-library/react';
import { ReviewJournalCard } from '@/components/reviews/review-journal-card';
import { getReviewJournals } from '@/lib/review-fixtures';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

/**
 * @fileOverview [UI-REVIEW-001] ReviewJournalCard 테스트
 */
describe('ReviewJournalCard', () => {
  const sample = getReviewJournals()[0];

  it('당일 수익률, 규율 위반 키워드, AI 한줄평을 모두 표시해야 합니다.', () => {
    render(<ReviewJournalCard entry={sample} />);

    expect(screen.getByTestId(`review-return-${sample.id}`)).toHaveTextContent('+2.4%');
    expect(screen.getByTestId(`review-violations-${sample.id}`)).toHaveTextContent('FOMO');
    expect(screen.getByTestId(`review-violations-${sample.id}`)).toHaveTextContent('Overtrade');
    expect(screen.getByTestId(`review-ai-summary-${sample.id}`)).toHaveTextContent(sample.aiSummary);
  });

  it('규율 위반이 없으면 No Violations 배지를 표시해야 합니다.', () => {
    const cleanEntry = getReviewJournals().find((j) => j.violationKeywords.length === 0)!;
    render(<ReviewJournalCard entry={cleanEntry} />);

    expect(within(screen.getByTestId(`review-violations-${cleanEntry.id}`)).getByText(/No Violations/i)).toBeInTheDocument();
  });

  it('상세 페이지 링크를 제공해야 합니다.', () => {
    render(<ReviewJournalCard entry={sample} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', `/review/${sample.id}`);
  });
});
