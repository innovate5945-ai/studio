"use client"

// @file src/components/reviews/review-timeline-chart.tsx
/**
 * @overview [UI-REVIEW-002] 매매 타임라인 라인 차트 — 누적 손익 + 이벤트 마커.
 *
 * @call-flow
 * 1. ReviewDetailView → detail.timeline
 * 2. ReviewTimelineChart → LineChart + ReferenceDot (entry/exit/win/loss)
 * 3. formatTimelinePnl — tooltip 원화 표시
 *
 * @see src/lib/review-detail-fixtures.ts, src/components/reviews/review-detail-view.tsx
 */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  formatTimelinePnl,
  type TimelineTradePoint,
} from "@/lib/review-detail-fixtures"

type ReviewTimelineChartProps = {
  timeline: TimelineTradePoint[]
  dateLabel: string
}


/** 당일 매매 누적 손익 타임라인 차트. */
export function ReviewTimelineChart({ timeline, dateLabel }: ReviewTimelineChartProps) {
  const eventPoints = timeline.filter((point) => point.eventType)

  return (
    <Card className="border-white/5 bg-card/50 backdrop-blur-md" data-testid="review-timeline-chart">
      <CardHeader>
        <CardTitle className="font-headline text-xl sm:text-2xl">매매 타임라인</CardTitle>
        <CardDescription>{dateLabel} · 누적 손익(원) 추이</CardDescription>
      </CardHeader>
      <CardContent className="h-[280px] sm:h-[360px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickFormatter={(value) => `${Math.round(value / 1000)}k`}
              width={48}
            />
            <Tooltip
              formatter={(value: number, _name, props) => {
                const payload = props.payload as TimelineTradePoint;
                const label = payload.tradeLabel ? ` · ${payload.tradeLabel}` : "";
                return [`${formatTimelinePnl(value)}${label}`, "누적 손익"];
              }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderRadius: "12px",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Line
              type="monotone"
              dataKey="cumulativePnl"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 4, fill: "hsl(var(--primary))" }}
              activeDot={{ r: 6 }}
            />
            {eventPoints.map((point) => (
              <ReferenceDot
                key={`${point.time}-${point.tradeLabel}`}
                x={point.time}
                y={point.cumulativePnl}
                r={6}
                fill={
                  point.eventType === "loss"
                    ? "hsl(var(--destructive))"
                    : point.eventType === "win"
                      ? "hsl(var(--chart-2, 142 76% 36%))"
                      : "hsl(var(--accent))"
                }
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
