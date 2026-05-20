"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Clock, 
  Target, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  Share2,
  Trash2,
  Edit3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const chartData = [
  { time: "09:30", price: 150 },
  { time: "09:45", price: 152 },
  { time: "10:00", price: 151 },
  { time: "10:15", price: 148 }, // Entry Point (Short)
  { time: "10:30", price: 145 },
  { time: "10:45", price: 147 },
  { time: "11:00", price: 142 }, // Exit Point
  { time: "11:15", price: 140 },
]

export default function TradeDetailPage() {
  const router = useRouter()
  const { id } = useParams()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to logs
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="border-white/5"><Share2 className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" className="border-white/5"><Edit3 className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" className="border-white/5 text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-white/5 bg-card/30">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-headline font-bold">BTC/USDT</h1>
                  <Badge className="bg-destructive/20 text-destructive border-destructive/20 font-bold uppercase">Short</Badge>
                </div>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Clock className="w-3 h-3" />
                  Oct 24, 2023 • 10:15 AM - 11:00 AM (45m)
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Net PnL</p>
                <h2 className="text-4xl font-headline font-bold text-destructive">-$150.20</h2>
              </div>
            </CardHeader>
            <CardContent className="pt-8 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11}} />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Area 
                    type="stepAfter" 
                    dataKey="price" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-white/5 bg-card/30">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Entry Logic
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Attempted to catch a trend reversal after a failed break of the 28.5k level. RSI was overbought on the 5m timeframe.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">RSI Overbought</Badge>
                  <Badge variant="secondary">Double Top</Badge>
                  <Badge variant="secondary">Resistance</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-card/30">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Discipline Errors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Entered before the candle close. "Anticipating" the move rather than waiting for confirmation.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="destructive">FOMO</Badge>
                  <Badge variant="destructive">Early Entry</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-lg">
                <Lightbulb className="w-5 h-5 text-primary" />
                Post-Trade Insight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-bold">AI Summary:</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  You had the right thesis but poor timing. If you had waited 15 more minutes for the confirmation candle, your risk-reward would have improved by 40%.
                </p>
              </div>
              <Separator className="bg-primary/10" />
              <div className="space-y-2">
                <p className="text-sm font-bold">Key Learning:</p>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  Wait for the candle close on the higher timeframe.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-card/30">
            <CardHeader>
              <CardTitle className="text-lg">Execution Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <MetricItem label="Risk to Reward" value="1:1.2" />
              <MetricItem label="Slippage" value="0.05%" />
              <MetricItem label="Commission" value="$12.40" />
              <MetricItem label="MAE (Max Adverse)" value="-$400" />
              <MetricItem label="MFE (Max Favorable)" value="+$200" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MetricItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-mono font-bold">{value}</span>
    </div>
  )
}