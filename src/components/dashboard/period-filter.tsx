"use client"

// @file src/components/dashboard/period-filter.tsx
/**
 * @overview [UI-DASH-001] 대시보드 기간 필터 — 1w / 1m / 3m 토글.
 *
 * @call-flow
 * 1. DASHBOARD_PERIOD_OPTIONS (lib) → Button 그룹
 * 2. onChange(period) → DashboardAnalytics state → getDashboardData 재조회
 *
 * @see src/lib/dashboard-fixtures.ts, src/components/dashboard/dashboard-analytics.tsx
 */
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DASHBOARD_PERIOD_OPTIONS,
  type DashboardPeriod,
} from "@/lib/dashboard-fixtures"

type PeriodFilterProps = {
  value: DashboardPeriod
  onChange: (period: DashboardPeriod) => void
  className?: string
}


/** 대시보드 분석 기간(1w/1m/3m) 선택 버튼 그룹. */
export function PeriodFilter({ value, onChange, className }: PeriodFilterProps) {
  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      role="group"
      aria-label="기간 필터"
      data-testid="period-filter"
    >
      {DASHBOARD_PERIOD_OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          size="sm"
          variant={value === option.value ? "default" : "outline"}
          className={cn(
            "min-w-[72px] flex-1 sm:flex-none font-semibold",
            value === option.value && "shadow-md shadow-primary/20"
          )}
          onClick={() => onChange(option.value)}
          data-testid={`period-filter-${option.value}`}
          aria-pressed={value === option.value}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
