"use client"

import * as React from "react"
import { Play, Square, Plus, Minus, RotateCcw, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FactBombModal } from "@/components/ai/fact-bomb-modal"
import { DashboardAnalytics } from "@/components/dashboard/dashboard-analytics"
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
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground">
            Command Center
          </h1>
          <p className="text-muted-foreground">
            Real-time equity curve and discipline monitoring.
          </p>
        </div>
        <Button
          onClick={handleSessionToggle}
          disabled={cooldown.active}
          variant={isSessionActive ? "destructive" : "default"}
          className={cn(
            "w-full sm:w-auto font-bold transition-all duration-300",
            !isSessionActive && !cooldown.active && "bg-emerald-500 hover:bg-emerald-600 text-white"
          )}
        >
          {isSessionActive ? (
            <><Square className="w-4 h-4 mr-2 fill-current" /> Stop Session</>
          ) : (
            <><Play className="w-4 h-4 mr-2 fill-current" /> Start Session</>
          )}
        </Button>
      </header>

      <Card className="border-white/5 bg-card/50 backdrop-blur-md">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-xl">Live Session Monitor</CardTitle>
            <CardDescription>
              세션 활성화 후 매매/손실을 기록하면 alert-settings 임계값과 비교해 자동 알람이 발생합니다.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={resetSessionMetrics} disabled={cooldown.active} className="w-full sm:w-auto">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Metrics
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 grid grid-cols-1 xs:grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <p className="text-muted-foreground">당일 손실</p>
              <p className={cn("text-2xl font-bold", lossNearLimit && "text-destructive")}>
                {sessionMetrics.dailyLossPercent}% / {settings.lossLimit}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <p className="text-muted-foreground">매매 횟수</p>
              <p className={cn("text-2xl font-bold", tradeNearCap && "text-destructive")}>
                {sessionMetrics.tradeCount} / {settings.tradeCap}회
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button
              variant="secondary"
              onClick={recordTrade}
              disabled={!isSessionActive || cooldown.active}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              +1 Trade
            </Button>
            <Button
              variant="secondary"
              onClick={() => addLoss(1)}
              disabled={!isSessionActive || cooldown.active}
              className="w-full sm:w-auto"
            >
              <Minus className="w-4 h-4 mr-2" />
              +1% Loss
            </Button>
          </div>
        </CardContent>
      </Card>

      <DashboardAnalytics />

      <Card className="border-primary/20 bg-primary/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <Zap className="w-8 h-8 text-primary/20 group-hover:text-primary transition-colors" />
        </div>
        <CardHeader>
          <CardTitle className="text-primary font-headline">AI Reality-Check</CardTitle>
          <CardDescription className="text-primary/70">
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
