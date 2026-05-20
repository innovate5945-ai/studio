"use client"

import * as React from "react"
import { Sparkles, BrainCircuit, Terminal, AlertTriangle, CheckCircle, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { aiRealityCheckFactBomb, type AIRealityCheckOutput } from "@/ai/flows/ai-reality-check-fact-bomb"
import { Badge } from "@/components/ui/badge"

export function FactBombModal() {
  const [loading, setLoading] = React.useState(false)
  const [report, setReport] = React.useState<AIRealityCheckOutput | null>(null)

  const triggerAnalysis = async () => {
    setLoading(true)
    try {
      // Mock logs for demonstration
      const mockLogs = "Trade 1: BUY AAPL, Result: -$500, Reason: FOMO at resistance. Trade 2: BUY BTC, Result: -$200, Reason: Revenge trading after first loss. Trade 3: SELL TSLA, Result: +$100, Reason: Scalp but exited too early."
      const result = await aiRealityCheckFactBomb({ tradeLogs: mockLogs })
      setReport(result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Fact-Bomb
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-background border-white/10 overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 border-b border-white/5 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-headline font-bold">AI Reality-Check</DialogTitle>
              <DialogDescription className="text-primary/70">
                Data-driven critique of your psychological biases.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {!report && !loading && (
            <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                <Terminal className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-xl font-bold">Ready for the truth?</h3>
                <p className="text-muted-foreground">
                  Our AI will scan your last 24 hours of trading logs and deliver a "Fact-Bomb" report. It's designed to be blunt and helpful.
                </p>
              </div>
              <Button onClick={triggerAnalysis} size="lg" className="px-12 py-6 text-lg font-bold">
                Deploy Fact-Bomb
              </Button>
            </div>
          )}

          {loading && (
            <div className="p-24 flex flex-col items-center justify-center space-y-6">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <div className="text-center animate-pulse">
                <p className="font-headline font-bold text-xl">Analyzing Psychological Markers...</p>
                <p className="text-sm text-muted-foreground mt-1">Cross-referencing equity curve with entry signals.</p>
              </div>
            </div>
          )}

          {report && (
            <ScrollArea className="h-full">
              <div className="p-8 space-y-10">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Brutal Critique</h4>
                  <p className="text-lg font-medium leading-relaxed italic text-foreground border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-xl">
                    "{report.critiqueSummary}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-destructive flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Bad Habits Detected
                    </h4>
                    <div className="space-y-2">
                      {report.badHabitsIdentified.map((habit, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/10">
                          <Badge variant="destructive" className="mt-0.5">{i+1}</Badge>
                          <span className="text-sm">{habit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Action Plan
                    </h4>
                    <div className="space-y-2">
                      {report.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                          <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pb-8">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-accent">Metric Deep-Dive</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {report.dataDrivenInsights.map((insight, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-foreground">{insight.metric}</span>
                          <Badge variant="secondary" className="font-mono text-primary">{insight.value}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{insight.insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>

        {report && (
          <div className="p-4 border-t border-white/5 bg-background flex justify-between items-center">
             <span className="text-xs text-muted-foreground font-mono">ID: FB-29384-ANALYSIS</span>
             <Button variant="ghost" size="sm" onClick={() => setReport(null)}>Reset Analysis</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}