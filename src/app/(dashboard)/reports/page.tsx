// @file src/app/(dashboard)/reports/page.tsx
/**
 * @overview [UI-DASH-002] Performance Reports 페이지 — 주간/월간 리포트.
 *
 * @call-flow
 * 1. /reports → ReportsPage → ReportsView
 * 2. ReportTypeTabs → getReportData(reportType)
 * 3. ReportDetailPanel + ReportCardList
 *
 * @see src/components/reports/reports-view.tsx, src/lib/report-fixtures.ts
 */
import { ReportsView } from "@/components/reports/reports-view"

export default function ReportsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ReportsView />
    </div>
  )
}
