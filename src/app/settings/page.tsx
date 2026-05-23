"use client"

import * as React from "react"
import { Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertSettingForm } from "@/components/alert-setting-form"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = React.useState(true)

  // 컴포넌트 마운트 시 로딩 상태 시뮬레이션
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleSave = async (data: { lossLimit: number; tradeCap: number }) => {
    console.log("Saving Alert Settings:", data)
    // 실제 API 호출 로직이 들어갈 자리
    return new Promise<void>((resolve) => setTimeout(resolve, 1000))
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-headline font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Discipline Thresholds
        </h1>
        <p className="text-muted-foreground text-lg">
          Configure real-time automated enforcement for your trading psychology.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* 새롭게 구현된 알람 설정 폼 */}
          <AlertSettingForm 
            isLoading={isLoading} 
            onSave={handleSave} 
          />
        </div>

        <div className="space-y-6">
          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-bold">Why this matters?</AlertTitle>
            <AlertDescription className="text-muted-foreground leading-relaxed mt-2">
              Statistically, trading after a 2.5% drawdown leads to a 60% higher probability of further loss due to emotional fatigue.
            </AlertDescription>
          </Alert>
          
          <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 overflow-hidden relative group">
            <div className="absolute top-0 left-0 h-1 bg-primary w-full group-hover:bg-accent transition-colors" />
            <h3 className="text-lg font-bold mb-2">Risk Strategy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Based on your settings, IronTrader will enforce a 30-minute cooldown if your equity drops more than the set threshold in 24h.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
