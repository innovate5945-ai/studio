"use client"

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
      className="border-white/5 bg-card/50 backdrop-blur-md"
      data-testid="report-detail-panel"
    >
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <CardTitle className="font-headline text-xl sm:text-2xl">{report.summaryTitle}</CardTitle>
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {report.periodCaption}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3" data-testid="report-key-insights">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Key Insights
          </h3>
          <ul className="space-y-2">
            {report.keyInsights.map((insight) => (
              <li
                key={insight}
                className="text-sm font-medium px-3 py-2 rounded-lg bg-primary/5 border border-primary/10"
              >
                {insight}
              </li>
            ))}
          </ul>
        </div>

        <Separator className="bg-white/10" />

        <div className="space-y-4" data-testid="report-analysis-text">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            상세 분석
          </h3>
          {report.analysisParagraphs.map((paragraph, index) => (
            <p
              key={`${report.type}-p-${index}`}
              className="text-sm sm:text-base text-foreground/90 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
