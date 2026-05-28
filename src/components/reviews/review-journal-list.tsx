"use client"

// @file src/components/reviews/review-journal-list.tsx
/**
 * @overview [UI-REVIEW-001] 복기 일지 카드 리스트 — ReviewJournalCard 매핑.
 *
 * @call-flow
 * 1. ReviewsView → ReviewJournalList({ entries })
 * 2. entries 미전달 시 getReviewJournals() fallback
 * 3. ReviewJournalCard — 날짜별 스냅 카드 렌더
 *
 * @see src/lib/review-fixtures.ts, src/components/reviews/review-journal-card.tsx
 */
import { getReviewJournals, type ReviewJournalEntry } from "@/lib/review-fixtures"
import { ReviewJournalCard } from "@/components/reviews/review-journal-card"

type ReviewJournalListProps = {
  entries?: ReviewJournalEntry[]
}


/** 복기 일지 엔트리 목록을 ReviewJournalCard로 렌더링합니다. */
export function ReviewJournalList({ entries }: ReviewJournalListProps) {
  const journals = entries ?? getReviewJournals()

  return (
    <div className="space-y-4" data-testid="review-journal-list">
      {journals.map((entry) => (
        <ReviewJournalCard key={entry.id} entry={entry} />
      ))}
    </div>
  )
}

export { getReviewJournals }
