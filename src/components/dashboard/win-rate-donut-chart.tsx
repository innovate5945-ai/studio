"use client"

// @file src/components/dashboard/win-rate-donut-chart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatWinRate } from "@/lib/dashboard-fixtures"

type WinRateDonutChartProps = {
  winRate: number
  winCount: number
  lossCount: number
}

const COLORS = {
  win: "hsl(var(--primary))",
  loss: "hsl(var(--destructive))",
};

/**
 * @fileOverview [UI-DASH-001] 승률 도넛 차트 (%)
 */
export function WinRateDonutChart({ winRate, winCount, lossCount }: WinRateDonutChartProps) {
  const chartData = [
    { name: "승", value: winCount, fill: COLORS.win },
    { name: "패", value: lossCount, fill: COLORS.loss },
  ]

  return (
    <Card className="border-white/5 bg-card/50 backdrop-blur-md" data-testid="win-rate-chart">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-lg sm:text-xl">승률</CardTitle>
        <CardDescription>Win / Loss 분포</CardDescription>
      </CardHeader>
      <CardContent className="relative h-[240px] sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={3}
              strokeWidth={0}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-3xl sm:text-4xl font-headline font-bold text-foreground"
            data-testid="win-rate-value"
          >
            {formatWinRate(winRate)}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {winCount}승 · {lossCount}패
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
