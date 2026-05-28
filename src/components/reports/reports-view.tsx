"use client"

// @file src/components/reports/reports-view.tsx
/**
 * @overview [UI-DASH-002] 리포트 메인 뷰 — 주간/월간 성과 리포트 페이지 본문.
 *
 * @call-flow
 * 1. reports/page → ReportsView
 * 2. ReportTypeTabs → getReportData(reportType) (lib fixture)
 * 3. ReportDetailPanel + ReportCardList — analysis·카드 그리드
 *
 * @see src/lib/report-fixtures.ts, src/app/(dashboard)/reports/page.tsx
 */
import * as React from "react"
import { Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/page-header"
import { getReportData, type ReportType } from "@/lib/report-fixtures"
import { ReportTypeTabs } from "@/components/reports/report-type-tabs"
import { ReportCardList } from "@/components/reports/report-card-list"
import { ReportDetailPanel } from "@/components/reports/report-detail-panel"


/** 주간/월간 리포트 탭·상세·카드 목록을 묶는 메인 뷰. */
export function ReportsView() {
  const [reportType, setReportType] = React.useState<ReportType>("weekly")
  const report = React.useMemo(() => getReportData(reportType), [reportType])

  return (
    <div className="page-shell" data-testid="reports-view">
      <PageHeader
        eyebrow="Analytics"
        title="Performance Reports"
        description={`${report.typeLabel} 기준 트레이딩 성과를 조회합니다.`}
        actions={
          <>
            <ReportTypeTabs value={reportType} onChange={setReportType} />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-white/5 bg-card/50 sm:flex-none">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button className="flex-1 bg-primary font-semibold text-primary-foreground sm:flex-none">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </>
        }
      />

      <div
        key={reportType}
        className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-2"
        data-testid="report-content"
      >
        <ReportDetailPanel report={report} />
        <section className="space-y-4">
          <div className="section-header">
            <div className="space-y-1">
              <h2 className="section-title">{report.typeLabel} 카드</h2>
              <p className="section-description">기간별 핵심 지표를 빠르게 비교합니다.</p>
            </div>
            <span className="eyebrow shrink-0">{report.cards.length}건</span>
          </div>
          <ReportCardList cards={report.cards} />
        </section>
      </div>
    </div>
  )
}
