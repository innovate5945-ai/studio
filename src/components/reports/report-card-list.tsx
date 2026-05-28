"use client"

// @file src/components/reports/report-card-list.tsx
/**
 * @overview [UI-DASH-002] 리포트 카드 그리드 — 기간별 KPI 스냅샷 목록.
 *
 * @call-flow
 * 1. ReportsView → getReportData(type).cards
 * 2. ReportCardList({ cards }) → ReportCard 그리드
 * 3. formatReportPnl / formatReportWinRate — netPnl·승률 표시
 *
 * @see src/lib/report-fixtures.ts, src/components/reports/reports-view.tsx
 */
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  formatReportPnl,
  formatReportWinRate,
  type ReportCardItem,
} from "@/lib/report-fixtures"
import { Calendar, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react"

type ReportCardListProps = {
  cards: ReportCardItem[]
}


/** 리포트 카드 항목을 2열 그리드로 렌더링합니다. */
export function ReportCardList({ cards }: ReportCardListProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      data-testid="report-card-list"
    >
      {cards.map((card) => (
        <ReportCard key={card.id} card={card} />
      ))}
    </div>
  )
}

function ReportCard({ card }: { card: ReportCardItem }) {
  const isPositive = card.netPnl >= 0

  return (
    <Card
      className="border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors"
      data-testid={`report-card-${card.id}`}
    >
      <CardHeader className="pb-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="font-headline text-lg truncate">{card.title}</CardTitle>
            <CardDescription className="flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{card.dateRange}</span>
            </CardDescription>
          </div>
          <Badge
            variant={card.status === "verified" ? "default" : "secondary"}
            className="shrink-0 text-[10px]"
          >
            {card.status === "verified" ? "Verified" : "Draft"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{card.periodLabel}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <MetricBox label="승률" value={formatReportWinRate(card.winRate)} />
          <MetricBox
            label="순손익"
            value={formatReportPnl(card.netPnl)}
            className={cn(isPositive ? "text-emerald-400" : "text-destructive")}
          />
          <MetricBox label="매매" value={`${card.tradeCount}회`} />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" />
            규율 {card.disciplineScore}점
          </span>
          <span className="flex items-center gap-1 font-medium">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
            <span className="text-xs text-muted-foreground truncate max-w-[140px]">
              {card.highlight}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricBox({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className="p-2 rounded-lg bg-white/5">
      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{label}</p>
      <p className={cn("text-sm font-bold mt-1 truncate", className)}>{value}</p>
    </div>
  )
}
