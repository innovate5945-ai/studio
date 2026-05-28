"use client"

// @file src/app/(dashboard)/page.tsx
/**
 * @overview Command Center (/) — Live Session Monitor, DashboardAnalytics, AI Fact-Bomb.
 *
 * @call-flow
 * useDiscipline() → recordTrade/addLoss → evaluateDisciplineBreach (via Provider)
 * DashboardAnalytics → getDashboardData (lib/dashboard-fixtures)
 */
import * as React from "react"
import { Play, Square, Plus, Minus, RotateCcw, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FactBombModal } from "@/components/ai/fact-bomb-modal"
import { DashboardAnalytics } from "@/components/dashboard/dashboard-analytics"
import { PageHeader } from "@/components/layout/page-header"
import { useDiscipline } from "@/contexts/discipline-provider"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const {
    settings,
    sessionMetrics,
    isSessionActive,
    cooldown,
    startSession,
    stopSession,
    recordTrade,
    addLoss,
    resetSessionMetrics,
  } = useDiscipline()

  const handleSessionToggle = () => {
    if (isSessionActive) {
      stopSession()
    } else {
      startSession()
    }
  }

  const lossNearLimit = sessionMetrics.dailyLossPercent >= settings.lossLimit * 0.8
  const tradeNearCap = sessionMetrics.tradeCount >= settings.tradeCap * 0.8

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Live Monitoring"
        title="Command Center"
        description="Real-time equity curve and discipline monitoring."
        actions={
          <Button
            onClick={handleSessionToggle}
            disabled={cooldown.active}
            variant={isSessionActive ? "destructive" : "default"}
            className={cn(
              "w-full font-semibold transition-all duration-300 sm:w-auto",
              !isSessionActive && !cooldown.active && "bg-emerald-500 text-white hover:bg-emerald-600"
            )}
          >
            {isSessionActive ? (
              <>
                <Square className="mr-2 h-4 w-4 fill-current" /> Stop Session
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4 fill-current" /> Start Session
              </>
            )}
          </Button>
        }
      />

      <Card className="surface-card-muted">
        <CardHeader className="flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle className="font-headline text-lg font-semibold sm:text-xl">
              Live Session Monitor
            </CardTitle>
            <CardDescription className="max-w-prose leading-relaxed">
              세션 활성화 후 매매/손실을 기록하면 alert-settings 임계값과 비교해 자동 알람이 발생합니다.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetSessionMetrics}
            disabled={cooldown.active}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Metrics
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 pt-6 md:flex-row md:items-center">
          <div className="grid flex-1 grid-cols-1 gap-4 xs:grid-cols-2">
            <div className="rounded-lg border border-white/5 bg-white/5 p-4">
              <p className="stat-label">당일 손실</p>
              <p className={cn("stat-value mt-1", lossNearLimit && "text-destructive")}>
                {sessionMetrics.dailyLossPercent}%
                <span className="ml-1 text-base font-medium text-muted-foreground">
                  / {settings.lossLimit}%
                </span>
              </p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/5 p-4">
              <p className="stat-label">매매 횟수</p>
              <p className={cn("stat-value mt-1", tradeNearCap && "text-destructive")}>
                {sessionMetrics.tradeCount}
                <span className="ml-1 text-base font-medium text-muted-foreground">
                  / {settings.tradeCap}회
                </span>
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <Button
              variant="secondary"
              onClick={recordTrade}
              disabled={!isSessionActive || cooldown.active}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              +1 Trade
            </Button>
            <Button
              variant="secondary"
              onClick={() => addLoss(1)}
              disabled={!isSessionActive || cooldown.active}
              className="w-full sm:w-auto"
            >
              <Minus className="mr-2 h-4 w-4" />
              +1% Loss
            </Button>
          </div>
        </CardContent>
      </Card>

      <DashboardAnalytics />

      <Card className="group relative overflow-hidden border-primary/20 bg-primary/5">
        <div className="absolute right-0 top-0 p-4">
          <Zap className="h-8 w-8 text-primary/20 transition-colors group-hover:text-primary" />
        </div>
        <CardHeader className="space-y-1.5">
          <CardTitle className="font-headline text-lg font-semibold text-primary sm:text-xl">
            AI Reality-Check
          </CardTitle>
          <CardDescription className="max-w-prose leading-relaxed text-primary/70">
            Request a brutal data-driven critique of your current session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FactBombModal />
        </CardContent>
      </Card>
    </div>
  )
}
