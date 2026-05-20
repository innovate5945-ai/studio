"use client"

import * as React from "react"
import { Timer, AlertTriangle, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function CooldownBanner() {
  const [timeLeft, setTimeLeft] = React.useState(1800) // 30 minutes in seconds
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  if (!isVisible || timeLeft <= 0) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="sticky top-0 z-50 w-full animate-in slide-in-from-top duration-500">
      <div className="bg-destructive/15 border-b border-destructive/20 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-destructive/20 p-2 rounded-full">
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-semibold text-destructive-foreground">
              Discipline Breach: Mandatory Cooldown Active
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum trade frequency exceeded. Self-reflection period required.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner">
            <Timer className="w-4 h-4 text-primary animate-pulse" />
            <span className="font-mono text-sm font-bold tracking-tighter">
              {formatTime(timeLeft)}
            </span>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/5 rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}