"use client"

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

/**
 * @fileOverview [UI-DASH-001] 통합 대시보드 분석 섹션
 * 기간 필터 + 승률(%) / MDD(%) / 매매횟수(회) / 순손익(원) 차트
 */
export function DashboardAnalytics() {
  const [period, setPeriod] = React.useState<DashboardPeriod>("1w")
  const data = React.useMemo(() => getDashboardData(period), [period])

  return (
    <section className="space-y-6" data-testid="dashboard-analytics">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-headline font-bold">Performance Analytics</h2>
          <p className="text-sm text-muted-foreground">
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
    <Card className="border-white/5 bg-card/50" data-testid={testId}>
      <CardContent className="p-4 sm:p-5 flex items-center gap-4">
        <div className="bg-white/5 p-3 rounded-2xl shrink-0">{icon}</div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-xl sm:text-2xl font-headline font-bold truncate">
            {value}
            <span className="text-sm font-medium text-muted-foreground ml-1">{unit}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export { getDashboardData };
