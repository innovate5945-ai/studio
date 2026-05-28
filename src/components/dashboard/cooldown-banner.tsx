"use client"

// @file src/components/dashboard/cooldown-banner.tsx
/**
 * @overview [UI-ALERT-002] 쿨타임 sticky 배너 — 규율 위반 시 남은 시간 카운트다운 표시.
 *
 * @call-flow
 * DisciplineProvider.cooldown.active → CooldownBanner render → formatCooldownTime(timeLeft)
 *
 * @see src/contexts/discipline-provider.tsx
 */
import * as React from "react"
import { Timer, AlertTriangle } from "lucide-react"
import { useDiscipline } from "@/contexts/discipline-provider"
import { formatCooldownTime } from "@/lib/discipline"

/** 규율 위반 쿨타임이 active일 때 상단 sticky 배너를 렌더링합니다. */
export function CooldownBanner() {
  const { cooldown, timeLeft } = useDiscipline()

  if (!cooldown.active || timeLeft <= 0) return null

  const breachLabel =
    cooldown.breachType === "loss_limit"
      ? "손실 한도 초과"
      : cooldown.breachType === "trade_cap"
        ? "매매 횟수 상한 도달"
        : "규율 위반"

  return (
    <div className="sticky top-0 z-50 w-full animate-in slide-in-from-top duration-500">
      <div className="flex items-center justify-between gap-4 border-b border-destructive/20 bg-destructive/15 px-4 py-3 backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-full bg-destructive/20 p-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-semibold text-foreground">
              Discipline Breach: Mandatory Cooldown Active
            </p>
            <p className="truncate text-xs leading-relaxed text-muted-foreground">
              {breachLabel} · {cooldown.reason}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-lg border border-white/5 bg-background/50 px-3 py-1.5 shadow-inner">
          <Timer className="h-4 w-4 animate-pulse text-primary" />
          <span className="font-mono text-sm font-bold tabular-nums tracking-tight">
            {formatCooldownTime(timeLeft)}
          </span>
        </div>
      </div>
    </div>
  )
}
