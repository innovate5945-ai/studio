"use client"

// @file src/contexts/discipline-provider.tsx
/**
 * @overview [UI-ALERT-002] 앱 전역 규율 상태 Provider — settings, session, cooldown, Fact-Bomb 플래그.
 *
 * @call-flow
 * 1. bootstrap: getAlertSettings ∥ getDisciplineCooldown → readStoredCooldown merge → applyCooldown
 * 2. session active: recordTrade / addLoss → evaluateDisciplineBreach → triggerBreach
 * 3. triggerBreach: startDisciplineCooldown → applyCooldown → setIsFactBombOpen(true)
 * 4. cooldown tick: getRemainingSeconds → 만료 시 clearStoredCooldown
 * 5. useDiscipline() — CooldownBanner, FactBombModal 등 하위 component 소비
 *
 * @see src/actions/alert-settings.ts, src/actions/discipline-cooldown.ts, src/lib/discipline.ts,
 *      src/app/layout.tsx, src/components/dashboard/cooldown-banner.tsx, src/components/ai/fact-bomb-modal.tsx
 */
import * as React from "react"
import { getAlertSettings } from "@/actions/alert-settings"
import { type AlertSettingsInput } from "@/lib/alert-settings"
import {
  getDisciplineCooldown,
  startDisciplineCooldown,
} from "@/actions/discipline-cooldown"
import { type DisciplineCooldownState } from "@/lib/discipline-cooldown"
import {
  DEFAULT_SESSION_METRICS,
  evaluateDisciplineBreach,
  getRemainingSeconds,
  readStoredCooldown,
  writeStoredCooldown,
  clearStoredCooldown,
  type SessionMetrics,
} from "@/lib/discipline"

type DisciplineContextValue = {
  settings: AlertSettingsInput
  sessionMetrics: SessionMetrics
  isSessionActive: boolean
  cooldown: DisciplineCooldownState
  timeLeft: number
  isFactBombOpen: boolean
  setIsFactBombOpen: (open: boolean) => void
  startSession: () => void
  stopSession: () => void
  recordTrade: () => void
  addLoss: (percent: number) => void
  resetSessionMetrics: () => void
}

const DisciplineContext = React.createContext<DisciplineContextValue | null>(null)

/** DisciplineProvider 하위에서 전역 규율 상태를 소비합니다. */
export function useDiscipline() {
  const context = React.useContext(DisciplineContext)
  if (!context) {
    throw new Error("useDiscipline must be used within DisciplineProvider")
  }
  return context
}

/** 루트 레이아웃에서 전역 규율 Context를 제공합니다. */
export function DisciplineProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<AlertSettingsInput>({
    lossLimit: 5,
    tradeCap: 5,
  })
  const [sessionMetrics, setSessionMetrics] = React.useState<SessionMetrics>(DEFAULT_SESSION_METRICS)
  const [isSessionActive, setIsSessionActive] = React.useState(false)
  const [cooldown, setCooldown] = React.useState<DisciplineCooldownState>({
    active: false,
    endsAt: null,
    breachType: null,
    reason: "",
  })
  const [timeLeft, setTimeLeft] = React.useState(0)
  const [isFactBombOpen, setIsFactBombOpen] = React.useState(false)
  const breachTriggeredRef = React.useRef(false)

  const applyCooldown = React.useCallback((state: DisciplineCooldownState) => {
    setCooldown(state)
    writeStoredCooldown(state)

    if (state.active && state.endsAt) {
      setTimeLeft(getRemainingSeconds(state.endsAt))
    } else {
      setTimeLeft(0)
      clearStoredCooldown()
      breachTriggeredRef.current = false
    }
  }, [])

  const triggerBreach = React.useCallback(
    async (breach: NonNullable<ReturnType<typeof evaluateDisciplineBreach>>) => {
      if (breachTriggeredRef.current || cooldown.active) return

      breachTriggeredRef.current = true
      const nextCooldown = await startDisciplineCooldown({
        breachType: breach.breachType,
        reason: breach.reason,
      })

      applyCooldown(nextCooldown)
      setIsFactBombOpen(true)
    },
    [applyCooldown, cooldown.active]
  )

  React.useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const [loadedSettings, serverCooldown] = await Promise.all([
        getAlertSettings(),
        getDisciplineCooldown(),
      ])

      if (cancelled) return

      setSettings(loadedSettings)

      const stored = readStoredCooldown()
      const merged = stored?.active && stored.endsAt && stored.endsAt > Date.now()
        ? stored
        : serverCooldown

      applyCooldown(merged)

      if (merged.active) {
        setIsFactBombOpen(true)
        breachTriggeredRef.current = true
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [applyCooldown])

  React.useEffect(() => {
    if (!isSessionActive || cooldown.active) return

    const breach = evaluateDisciplineBreach(sessionMetrics, settings)
    if (breach) {
      void triggerBreach(breach)
    }
  }, [sessionMetrics, settings, isSessionActive, cooldown.active, triggerBreach])

  React.useEffect(() => {
    if (!cooldown.active || !cooldown.endsAt) return

    const tick = () => {
      const remaining = getRemainingSeconds(cooldown.endsAt)
      setTimeLeft(remaining)

      if (remaining <= 0) {
        applyCooldown({
          active: false,
          endsAt: null,
          breachType: null,
          reason: "",
        })
      }
    }

    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [cooldown.active, cooldown.endsAt, applyCooldown])

  const startSession = React.useCallback(() => {
    setIsSessionActive(true)
  }, [])

  const stopSession = React.useCallback(() => {
    setIsSessionActive(false)
  }, [])

  const recordTrade = React.useCallback(() => {
    setSessionMetrics((prev) => ({
      ...prev,
      tradeCount: prev.tradeCount + 1,
    }))
  }, [])

  const addLoss = React.useCallback((percent: number) => {
    setSessionMetrics((prev) => ({
      ...prev,
      dailyLossPercent: Math.min(100, prev.dailyLossPercent + percent),
    }))
  }, [])

  const resetSessionMetrics = React.useCallback(() => {
    setSessionMetrics(DEFAULT_SESSION_METRICS)
    breachTriggeredRef.current = false
  }, [])

  const value = React.useMemo(
    () => ({
      settings,
      sessionMetrics,
      isSessionActive,
      cooldown,
      timeLeft,
      isFactBombOpen,
      setIsFactBombOpen,
      startSession,
      stopSession,
      recordTrade,
      addLoss,
      resetSessionMetrics,
    }),
    [
      settings,
      sessionMetrics,
      isSessionActive,
      cooldown,
      timeLeft,
      isFactBombOpen,
      startSession,
      stopSession,
      recordTrade,
      addLoss,
      resetSessionMetrics,
    ]
  )

  return (
    <DisciplineContext.Provider value={value}>
      {children}
    </DisciplineContext.Provider>
  )
}
