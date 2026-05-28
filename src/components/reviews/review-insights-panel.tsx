"use client"

// @file src/components/reviews/review-insights-panel.tsx
import { Bot, BrainCircuit, CheckCircle2, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { ReviewJournalDetail } from "@/lib/review-detail-fixtures"

type ReviewInsightsPanelProps = {
  detail: ReviewJournalDetail
}

/**
 * @fileOverview [UI-REVIEW-002] AI 인사이트 및 매매 심리 분석 요약 패널
 */
export function ReviewInsightsPanel({ detail }: ReviewInsightsPanelProps) {
  const { aiDeepAnalysis, violationKeywords } = detail

  return (
    <Card
      className="border-primary/20 bg-gradient-to-br from-primary/5 via-card/50 to-card/50 backdrop-blur-md overflow-hidden"
      data-testid="review-insights-panel"
    >
      <CardHeader className="space-y-4 pb-4 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/15">
            <BrainCircuit className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="font-headline text-lg sm:text-xl text-primary">
            인사이트 및 매매 심리 분석
          </CardTitle>
        </div>
        <h2
          className="text-2xl sm:text-3xl font-headline font-bold leading-tight tracking-tight text-foreground"
          data-testid="review-insights-headline"
        >
          {aiDeepAnalysis.headline}
        </h2>
        {violationKeywords.length > 0 && (
          <div className="flex flex-wrap gap-2" data-testid="review-insights-keywords">
            {violationKeywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="outline"
                className="border-destructive/30 text-destructive bg-destructive/5"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-8 space-y-8">
        <blockquote
          className="relative pl-6 border-l-4 border-primary/60 text-base sm:text-lg leading-relaxed text-foreground/90 italic"
          data-testid="review-psychology-summary"
        >
          <Bot className="absolute -left-1 -top-1 w-4 h-4 text-primary/60" />
          {aiDeepAnalysis.psychologySummary}
        </blockquote>

        <Separator className="bg-white/10" />

        <div className="space-y-8" data-testid="review-insight-sections">
          {aiDeepAnalysis.insightSections.map((section, index) => (
            <article key={section.title} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                {String(index + 1).padStart(2, "0")} · {section.title}
              </h3>
              <p className="text-sm sm:text-base leading-[1.75] text-foreground/85 max-w-prose">
                {section.body}
              </p>
            </article>
          ))}
        </div>

        <Separator className="bg-white/10" />

        <div className="space-y-4" data-testid="review-action-items">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Action Items
          </h3>
          <ul className="space-y-3">
            {aiDeepAnalysis.actionItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
