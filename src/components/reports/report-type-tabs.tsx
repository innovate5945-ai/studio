"use client"

// @file src/components/reports/report-type-tabs.tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { REPORT_TYPE_OPTIONS, type ReportType } from "@/lib/report-fixtures"

type ReportTypeTabsProps = {
  value: ReportType
  onChange: (type: ReportType) => void
  className?: string
}

/**
 * @fileOverview [UI-DASH-002] 주간/월간 리포트 토글 탭
 */
export function ReportTypeTabs({ value, onChange, className }: ReportTypeTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onChange(next as ReportType)}
      className={cn("w-full sm:w-auto", className)}
      data-testid="report-type-tabs"
    >
      <TabsList className="grid grid-cols-2 w-full sm:w-[280px] bg-white/5 border border-white/5 p-1 h-11">
        {REPORT_TYPE_OPTIONS.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-sm"
            data-testid={`report-tab-${option.value}`}
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
