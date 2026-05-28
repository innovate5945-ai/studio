"use client"

// @file src/components/reports/report-detail-panel.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Lightbulb } from "lucide-react"
import type { ReportDetail } from "@/lib/report-fixtures"

type ReportDetailPanelProps = {
  report: ReportDetail
}

/**
 * @fileOverview [UI-DASH-002] 리포트 상세 분석 패널
 */
export function ReportDetailPanel({ report }: ReportDetailPanelProps) {
  return (
    <Card
      className="surface-card-muted"
      data-testid="report-detail-panel"
    >
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle className="font-headline text-lg font-semibold sm:text-xl">
            {report.summaryTitle}
          </CardTitle>
        </div>
        <CardDescription className="leading-relaxed">{report.periodCaption}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3" data-testid="report-key-insights">
          <h3 className="eyebrow flex items-center gap-2 text-primary">
            <Lightbulb className="h-4 w-4" />
            Key Insights
          </h3>
          <ul className="space-y-2">
            {report.keyInsights.map((insight) => (
              <li
                key={insight}
                className="rounded-lg border border-primary/10 bg-primary/5 px-3 py-2.5 text-sm font-medium leading-relaxed"
              >
                {insight}
              </li>
            ))}
          </ul>
        </div>

        <Separator className="bg-white/10" />

        <div className="space-y-4" data-testid="report-analysis-text">
          <h3 className="eyebrow">상세 분석</h3>
          {report.analysisParagraphs.map((paragraph, index) => (
            <p
              key={`${report.type}-p-${index}`}
              className="text-sm leading-relaxed text-foreground/90 sm:text-base"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
