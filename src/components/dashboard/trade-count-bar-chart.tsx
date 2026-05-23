"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatTradeCount, type TradeDataPoint } from "@/lib/dashboard-fixtures"

type TradeCountBarChartProps = {
  series: TradeDataPoint[]
  totalTrades: number
}

/**
 * @fileOverview [UI-DASH-001] 매매횟수 막대 차트 (회)
 */
export function TradeCountBarChart({ series, totalTrades }: TradeCountBarChartProps) {
  return (
    <Card className="border-white/5 bg-card/50 backdrop-blur-md" data-testid="trade-count-chart">
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="font-headline text-lg sm:text-xl">매매횟수</CardTitle>
          <CardDescription>기간별 거래 빈도</CardDescription>
        </div>
        <span
          className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg shrink-0"
          data-testid="trade-total-value"
        >
          {formatTradeCount(totalTrades)}
        </span>
      </CardHeader>
      <CardContent className="h-[240px] sm:h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={series}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickFormatter={(value) => `${value}회`}
              width={48}
            />
            <Tooltip
              formatter={(value: number) => [formatTradeCount(value), "매매"]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderRadius: "12px",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Bar
              dataKey="value"
              fill="hsl(var(--primary))"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
