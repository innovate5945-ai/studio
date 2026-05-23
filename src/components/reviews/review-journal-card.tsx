"use client"

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

/**
 * @fileOverview [UI-REVIEW-001] 복기 일지 스냅 카드
 * 3분 스캔용: 당일 수익률 · 규율 위반 키워드 · AI 한줄평
 */
export function ReviewJournalCard({ entry }: ReviewJournalCardProps) {
  const tone = getReturnTone(entry.dailyReturnPercent)

  return (
    <Link href={`/review/${entry.id}`} className="block group">
      <Card
        className="border-white/5 bg-card/50 hover:bg-card/70 hover:border-primary/20 transition-all overflow-hidden"
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
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {entry.dateLabel}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {entry.tradeCount}회 매매 · 약 {entry.scanMinutes}분 스캔
                  </p>
                </div>

                <div
                  className="flex items-center gap-2 shrink-0"
                  data-testid={`review-return-${entry.id}`}
                >
                  <span className="text-xs font-semibold text-muted-foreground uppercase">당일 수익률</span>
                  <span
                    className={cn(
                      "text-xl sm:text-2xl font-headline font-bold",
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
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
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
                <p className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 mb-2">
                  <Bot className="w-3.5 h-3.5" />
                  AI 한줄평
                </p>
                <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
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
