"use client"

import { getReviewJournals } from "@/lib/review-fixtures"
import { ReviewJournalCard } from "@/components/reviews/review-journal-card"

/**
 * @fileOverview [UI-REVIEW-001] 복기 일지 날짜별 카드 리스트
 */
export function ReviewJournalList() {
  const journals = getReviewJournals()

  return (
    <div className="space-y-4" data-testid="review-journal-list">
      {journals.map((entry) => (
        <ReviewJournalCard key={entry.id} entry={entry} />
      ))}
    </div>
  )
}

export { getReviewJournals };
