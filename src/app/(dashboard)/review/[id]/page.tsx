// @file src/app/(dashboard)/review/[id]/page.tsx
/**
 * @overview [UI-REVIEW-002] 복기 일지 상세 페이지 — 타임라인·AI 분석.
 *
 * @call-flow
 * 1. /review/[id] → ReviewDetailPage → ReviewDetailView
 * 2. getReviewJournalById(id) — mock detail fixture
 * 3. ReviewTimelineChart + ReviewInsightsPanel
 *
 * @see src/components/reviews/review-detail-view.tsx, src/lib/review-detail-fixtures.ts
 */
import { ReviewDetailView } from "@/components/reviews/review-detail-view"

export default function ReviewDetailPage() {
  return <ReviewDetailView />
}
