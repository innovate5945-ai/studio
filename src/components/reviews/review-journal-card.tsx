"use client"

// @file src/components/reviews/review-journal-card.tsx
/**
 * @overview [UI-REVIEW-001] 3분 스캔용 일지 스냅 카드 — 수익률·위반 키워드·AI 요약.
 *
 * @call-flow
 * 1. ReviewJournalList → ReviewJournalCard({ entry })
 * 2. formatDailyReturn / getReturnTone — 수익률 색상·표시
 * 3. Link → /review/[id] 상세 페이지
 *
 * @see src/lib/review-fixtures.ts, src/app/(dashboard)/review/[id]/page.tsx
 */
import Link from "next/link"
import { ArrowRight, Bot, Calendar, ShieldAlert, TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  formatDailyReturn,
  getReturnTone,
  type ReviewJournalEntry,
} from "@/lib/review-fixtures"

type ReviewJournalCardProps = {
  entry: ReviewJournalEntry
}


/** 단일 복기 일지 스냅 카드 — 클릭 시 상세 페이지로 이동. */
export function ReviewJournalCard({ entry }: ReviewJournalCardProps) {
  const tone = getReturnTone(entry.dailyReturnPercent)

  return (
    <Link href={`/review/${entry.id}`} className="block group">
      <Card
        className="surface-card-muted transition-all hover:border-primary/20 hover:bg-card/70"
        data-testid={`review-journal-card-${entry.id}`}
      >
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            <div
              className={cn(
                "h-1 sm:h-auto sm:w-1.5 shrink-0",
                tone === "positive" && "bg-emerald-500",
                tone === "negative" && "bg-destructive",
                tone === "neutral" && "bg-muted-foreground"
              )}
            />

            <div className="flex-1 p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="eyebrow flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {entry.dateLabel}
                  </p>
                  <p className="prose-muted">
                    {entry.tradeCount}회 매매 · 약 {entry.scanMinutes}분 스캔
                  </p>
                </div>

                <div
                  className="flex shrink-0 items-center gap-2"
                  data-testid={`review-return-${entry.id}`}
                >
                  <span className="stat-label">당일 수익률</span>
                  <span
                    className={cn(
                      "font-headline text-xl font-bold tabular-nums sm:text-2xl",
                      tone === "positive" && "text-emerald-400",
                      tone === "negative" && "text-destructive",
                      tone === "neutral" && "text-foreground"
                    )}
                  >
                    {formatDailyReturn(entry.dailyReturnPercent)}
                  </span>
                  {tone === "positive" && <TrendingUp className="w-5 h-5 text-emerald-400" />}
                  {tone === "negative" && <TrendingDown className="w-5 h-5 text-destructive" />}
                </div>
              </div>

              <div className="space-y-2" data-testid={`review-violations-${entry.id}`}>
                <p className="eyebrow flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  주요 규율 위반 키워드
                </p>
                <div className="flex flex-wrap gap-2">
                  {entry.violationKeywords.length > 0 ? (
                    entry.violationKeywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="outline"
                        className="text-xs font-semibold border-destructive/30 text-destructive bg-destructive/5"
                      >
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-xs font-semibold border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                    >
                      No Violations
                    </Badge>
                  )}
                </div>
              </div>

              <div
                className="rounded-lg border border-primary/15 bg-primary/5 p-3 sm:p-4"
                data-testid={`review-ai-summary-${entry.id}`}
              >
                <p className="eyebrow mb-2 flex items-center gap-1.5 text-primary">
                  <Bot className="h-3.5 w-3.5" />
                  AI 한줄평
                </p>
                <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                  {entry.aiSummary}
                </p>
              </div>

              <div className="flex items-center justify-end text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                상세 보기
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
