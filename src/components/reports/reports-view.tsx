"use client"

import * as React from "react"
import { Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getReportData, type ReportType } from "@/lib/report-fixtures"
import { ReportTypeTabs } from "@/components/reports/report-type-tabs"
import { ReportCardList } from "@/components/reports/report-card-list"
import { ReportDetailPanel } from "@/components/reports/report-detail-panel"

/**
 * @fileOverview [UI-DASH-002] 주간/월간 리포트 조회 화면
 */
export function ReportsView() {
  const [reportType, setReportType] = React.useState<ReportType>("weekly")
  const report = React.useMemo(() => getReportData(reportType), [reportType])

  return (
    <div className="space-y-8" data-testid="reports-view">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground">
            Performance Reports
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            {report.typeLabel} 기준 트레이딩 성과를 조회합니다.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <ReportTypeTabs value={reportType} onChange={setReportType} />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 sm:flex-none border-white/5 bg-card/50">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button className="flex-1 sm:flex-none bg-primary text-primary-foreground font-bold">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div
        key={reportType}
        className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
        data-testid="report-content"
      >
        <ReportDetailPanel report={report} />
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-headline font-bold">
              {report.typeLabel} 카드
            </h2>
            <span className="text-sm text-muted-foreground shrink-0">
              {report.cards.length}건
            </span>
          </div>
          <ReportCardList cards={report.cards} />
        </section>
      </div>
    </div>
  )
}
