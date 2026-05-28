"use client"

// @file src/components/reviews/review-detail-view.tsx
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, TrendingDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatDailyReturn, getReturnTone } from "@/lib/review-fixtures"
import { getReviewJournalById } from "@/lib/review-detail-fixtures"
import { ReviewTimelineChart } from "@/components/reviews/review-timeline-chart"
import { ReviewInsightsPanel } from "@/components/reviews/review-insights-panel"

/**
 * @fileOverview [UI-REVIEW-002] 복기 일지 상세 대시보드
 */
export function ReviewDetailView() {
  const router = useRouter()
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : ""
  const detail = getReviewJournalById(id)

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4" data-testid="review-not-found">
        <p className="text-muted-foreground">복기 일지를 찾을 수 없습니다.</p>
        <Button asChild variant="outline">
          <Link href="/reviews">목록으로 돌아가기</Link>
        </Button>
      </div>
    )
  }

  const tone = getReturnTone(detail.dailyReturnPercent)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500" data-testid="review-detail-view">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/reviews")}
          className="w-full sm:w-auto hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          복기 일지 목록
        </Button>
        <Badge variant="outline" className="w-fit text-xs font-semibold">
          {detail.tradeCount}회 매매 · 약 {detail.scanMinutes}분 스캔
        </Badge>
      </div>

      <header className="space-y-3">
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {detail.dateLabel}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-headline font-bold">복기 일지 상세</h1>
          <div className="flex items-center gap-2" data-testid="review-detail-return">
            <span className="text-sm text-muted-foreground">당일 수익률</span>
            <span
              className={cn(
                "text-3xl font-headline font-bold",
                tone === "positive" && "text-emerald-400",
                tone === "negative" && "text-destructive",
                tone === "neutral" && "text-foreground"
              )}
            >
              {formatDailyReturn(detail.dailyReturnPercent)}
            </span>
            {tone === "positive" && <TrendingUp className="w-6 h-6 text-emerald-400" />}
            {tone === "negative" && <TrendingDown className="w-6 h-6 text-destructive" />}
          </div>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{detail.aiSummary}</p>
      </header>

      <ReviewTimelineChart timeline={detail.timeline} dateLabel={detail.dateLabel} />

      <ReviewInsightsPanel detail={detail} />

      <Card className="border-white/5 bg-card/30">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            AI 분석은 Genkit(Gemini) 기반 심층 리포트 Mock 데이터입니다.
          </p>
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <Link href="/reviews">목록으로 돌아가기</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
