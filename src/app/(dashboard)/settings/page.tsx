"use client"

// @file src/app/(dashboard)/settings/page.tsx
/**
 * @overview [UI-ALERT-001] Discipline Thresholds 설정 페이지 — 알람 임계값 조회·저장.
 *
 * @call-flow
 * 1. /settings → mount → getAlertSettings()
 * 2. AlertSettingForm({ defaultValues, isLoading, isError })
 * 3. 저장 → saveAlertSettings → toast 피드백
 *
 * @see src/actions/alert-settings.ts, src/components/alert-setting-form.tsx
 */
import * as React from "react"
import { Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertSettingForm } from "@/components/alert-setting-form"
import { PageHeader } from "@/components/layout/page-header"
import { getAlertSettings } from "@/actions/alert-settings"
import { type AlertSettingsInput } from "@/lib/alert-settings"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [isError, setIsError] = React.useState(false)
  const [settings, setSettings] = React.useState<AlertSettingsInput>({
    lossLimit: 5,
    tradeCap: 5,
  })

  React.useEffect(() => {
    let cancelled = false

    async function loadSettings() {
      try {
        const data = await getAlertSettings()
        if (!cancelled) {
          setSettings(data)
          setIsError(false)
        }
      } catch {
        if (!cancelled) {
          setIsError(true)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadSettings()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Discipline & Risk"
        title="Discipline Thresholds"
        description="Configure real-time automated enforcement for your trading psychology."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AlertSettingForm
            defaultValues={settings}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

        <aside className="space-y-6">
          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="font-semibold text-primary">Why this matters?</AlertTitle>
            <AlertDescription className="prose-muted mt-2">
              Statistically, trading after a 2.5% drawdown leads to a 60% higher probability of
              further loss due to emotional fatigue.
            </AlertDescription>
          </Alert>

          <div className="group relative overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="absolute left-0 top-0 h-1 w-full bg-primary transition-colors group-hover:bg-accent" />
            <h3 className="mb-2 text-base font-semibold text-foreground">Risk Strategy</h3>
            <p className="prose-muted">
              Based on your settings, IronTrader will enforce a 30-minute cooldown if your equity
              drops more than the set threshold in 24h.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
