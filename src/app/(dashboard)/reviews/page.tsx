// @file src/app/(dashboard)/reviews/page.tsx
/**
 * @overview [UI-REVIEW-001] Trade Logs 목록 페이지 — Snap-Scan 복기 일지.
 *
 * @call-flow
 * 1. /reviews → ReviewsPage → ReviewsView
 * 2. getReviewJournals (lib) → 검색 필터 → ReviewJournalList
 * 3. 카드 클릭 → /review/[id] 상세
 *
 * @see src/components/reviews/reviews-view.tsx, src/lib/review-fixtures.ts
 */
import { ReviewsView } from "@/components/reviews/reviews-view"

export default function ReviewsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ReviewsView />
    </div>
  )
}
