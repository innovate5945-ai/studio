"use client"

// @file src/components/dashboard/dashboard-analytics.tsx
/**
 * @overview [UI-DASH-001] 대시보드 성과 분석 섹션 — KPI 카드 + 3종 차트.
 *
 * @call-flow
 * 1. dashboard/page → DashboardAnalytics
 * 2. PeriodFilter → getDashboardData(period) (lib fixture)
 * 3. SummaryMetric 4종 + WinRateDonutChart + MddLineChart + TradeCountBarChart
 *
 * @see src/lib/dashboard-fixtures.ts, src/app/(dashboard)/page.tsx
 */
import * as React from "react"
import { TrendingUp, Target, Activity, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  getDashboardData,
  formatKrw,
  formatWinRate,
  formatMdd,
  formatTradeCount,
  type DashboardPeriod,
} from "@/lib/dashboard-fixtures"
import { PeriodFilter } from "@/components/dashboard/period-filter"
import { WinRateDonutChart } from "@/components/dashboard/win-rate-donut-chart"
import { MddLineChart } from "@/components/dashboard/mdd-line-chart"
import { TradeCountBarChart } from "@/components/dashboard/trade-count-bar-chart"


/** 기간 필터·KPI·차트를 묶는 대시보드 분석 섹션. */
export function DashboardAnalytics() {
  const [period, setPeriod] = React.useState<DashboardPeriod>("1w")
  const data = React.useMemo(() => getDashboardData(period), [period])

  return (
    <section className="space-y-6" data-testid="dashboard-analytics">
      <div className="section-header">
        <div className="space-y-1">
          <h2 className="section-title">Performance Analytics</h2>
          <p className="section-description">
            {data.periodLabel} 기준 핵심 지표 · 단위: % / 원 / 회
          </p>
        </div>
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryMetric
          title="승률"
          value={formatWinRate(data.winRate)}
          unit="%"
          icon={<Target className="w-5 h-5 text-primary" />}
          testId="summary-win-rate"
        />
        <SummaryMetric
          title="순손익"
          value={formatKrw(data.netPnl)}
          unit="원"
          icon={<TrendingUp className="w-5 h-5 text-accent" />}
          testId="summary-net-pnl"
        />
        <SummaryMetric
          title="최대 MDD"
          value={formatMdd(data.maxMdd)}
          unit="%"
          icon={<Activity className="w-5 h-5 text-destructive" />}
          testId="summary-max-mdd"
        />
        <SummaryMetric
          title="총 매매"
          value={String(data.totalTrades)}
          unit="회"
          icon={<Calendar className="w-5 h-5 text-orange-400" />}
          testId="summary-total-trades"
        />
      </div>

      <div
        key={period}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 animate-in fade-in duration-500"
        data-testid="dashboard-charts-grid"
      >
        <WinRateDonutChart
          winRate={data.winRate}
          winCount={data.winCount}
          lossCount={data.lossCount}
        />
        <MddLineChart series={data.mddSeries} maxMdd={data.maxMdd} />
        <TradeCountBarChart series={data.tradeSeries} totalTrades={data.totalTrades} />
      </div>
    </section>
  )
}

function SummaryMetric({
  title,
  value,
  unit,
  icon,
  testId,
}: {
  title: string
  value: string
  unit: string
  icon: React.ReactNode
  testId: string
}) {
  return (
    <Card className="surface-card-muted" data-testid={testId}>
      <CardContent className="flex items-center gap-4 p-4 sm:p-5">
        <div className="shrink-0 rounded-2xl bg-white/5 p-3">{icon}</div>
        <div className="min-w-0">
          <p className="stat-label">{title}</p>
          <p className="truncate font-headline text-xl font-bold tabular-nums tracking-tight sm:text-2xl">
            {value}
            <span className="ml-1 text-sm font-medium text-muted-foreground">{unit}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export { getDashboardData };
