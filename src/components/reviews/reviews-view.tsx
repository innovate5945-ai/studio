"use client"

// @file src/components/reviews/reviews-view.tsx
import * as React from "react"
import { Search, Timer } from "lucide-react"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/layout/page-header"
import { getReviewJournals } from "@/lib/review-fixtures"
import { ReviewJournalList } from "@/components/reviews/review-journal-list"

/**
 * @fileOverview [UI-REVIEW-001] 복기 일지 목록 화면
 */
export function ReviewsView() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const journals = React.useMemo(() => getReviewJournals(), [])

  const filtered = React.useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return journals

    return journals.filter(
      (entry) =>
        entry.dateLabel.toLowerCase().includes(query) ||
        entry.violationKeywords.some((k) => k.toLowerCase().includes(query)) ||
        entry.aiSummary.toLowerCase().includes(query)
    )
  }, [journals, searchTerm])

  return (
    <div className="page-shell" data-testid="reviews-view">
      <PageHeader
        eyebrow="AI Review"
        title="Snap-Scan Review Journal"
        description={
          <p className="page-description flex items-center gap-2">
            <Timer className="h-4 w-4 shrink-0 text-primary" />
            바쁜 투자자를 위한 3분 복기 사이클 · 날짜별 핵심 요약
          </p>
        }
        actions={
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="날짜, 키워드, AI 코멘트 검색..."
              className="h-11 border-white/5 bg-card/50 pl-9"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="복기 일지 검색"
              data-testid="review-search-input"
            />
          </div>
        }
      />

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground" data-testid="review-empty-state">
          검색 결과가 없습니다.
        </p>
      ) : (
        <ReviewJournalList entries={filtered} />
      )}
    </div>
  )
}
