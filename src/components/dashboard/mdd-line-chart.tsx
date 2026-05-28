"use client"

// @file src/components/dashboard/mdd-line-chart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatMdd, type MddDataPoint } from "@/lib/dashboard-fixtures"

type MddLineChartProps = {
  series: MddDataPoint[]
  maxMdd: number
}

/**
 * @fileOverview [UI-DASH-001] MDD 라인 차트 (%)
 */
export function MddLineChart({ series, maxMdd }: MddLineChartProps) {
  return (
    <Card className="border-white/5 bg-card/50 backdrop-blur-md" data-testid="mdd-line-chart">
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="font-headline text-lg sm:text-xl">MDD</CardTitle>
          <CardDescription>Maximum Drawdown 추이</CardDescription>
        </div>
        <span
          className="text-sm font-bold text-destructive bg-destructive/10 px-2.5 py-1 rounded-lg shrink-0"
          data-testid="mdd-max-value"
        >
          Max {formatMdd(maxMdd)}
        </span>
      </CardHeader>
      <CardContent className="h-[240px] sm:h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
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
              tickFormatter={(value) => `${value}%`}
              width={42}
            />
            <Tooltip
              formatter={(value: number) => [formatMdd(value), "MDD"]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderRadius: "12px",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--destructive))"
              strokeWidth={3}
              dot={{ r: 4, fill: "hsl(var(--destructive))" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
