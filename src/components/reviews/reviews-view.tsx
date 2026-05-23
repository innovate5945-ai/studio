"use client"

import * as React from "react"
import { Search, Timer } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getReviewJournals } from "@/lib/review-fixtures"
import { ReviewJournalList } from "@/components/reviews/review-journal-list"
import { ReviewJournalCard } from "@/components/reviews/review-journal-card"

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
    <div className="space-y-8" data-testid="reviews-view">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground">
            Snap-Scan Review Journal
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg flex items-center gap-2">
            <Timer className="w-4 h-4 text-primary shrink-0" />
            바쁜 투자자를 위한 3분 복기 사이클 · 날짜별 핵심 요약
          </p>
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="날짜, 키워드, AI 코멘트 검색..."
            className="pl-9 bg-card/50 border-white/5 h-11"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="복기 일지 검색"
            data-testid="review-search-input"
          />
        </div>
      </header>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12" data-testid="review-empty-state">
          검색 결과가 없습니다.
        </p>
      ) : (
        <div className="space-y-4" data-testid="review-journal-list">
          {filtered.map((entry) => (
            <ReviewJournalCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
