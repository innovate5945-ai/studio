"use client"

import * as React from "react"
import { Timer, AlertTriangle } from "lucide-react"
import { useDiscipline } from "@/contexts/discipline-provider"
import { formatCooldownTime } from "@/lib/discipline"

/**
 * @fileOverview [UI-ALERT-002] 쿨타임 배너
 * 규율 위반 시 상단에 고정되며 남은 쿨타임을 카운트다운합니다.
 */
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
      <div className="bg-destructive/15 border-b border-destructive/20 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-destructive/20 p-2 rounded-full shrink-0">
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-destructive-foreground">
              Discipline Breach: Mandatory Cooldown Active
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {breachLabel} · {cooldown.reason}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner shrink-0">
          <Timer className="w-4 h-4 text-primary animate-pulse" />
          <span className="font-mono text-sm font-bold tracking-tighter">
            {formatCooldownTime(timeLeft)}
          </span>
        </div>
      </div>
    </div>
  )
}
