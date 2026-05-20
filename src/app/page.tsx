
"use client"

import * as React from "react"
import { 
  TrendingUp, 
  Target, 
  Activity, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  LayoutGrid,
  Filter,
  Play,
  Square
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts"
import { FactBombModal } from "@/components/ai/fact-bomb-modal"
import { cn } from "@/lib/utils"

const data = [
  { day: "Mon", pnl: 120, volume: 5, mdd: 1.2 },
  { day: "Tue", pnl: -80, volume: 8, mdd: 2.1 },
  { day: "Wed", pnl: 340, volume: 3, mdd: 0.8 },
  { day: "Thu", pnl: 210, volume: 12, mdd: 1.5 },
  { day: "Fri", pnl: -150, volume: 6, mdd: 2.8 },
  { day: "Sat", pnl: 0, volume: 0, mdd: 2.8 },
  { day: "Sun", pnl: 450, volume: 2, mdd: 0.5 },
]

export default function DashboardPage() {
  const [period, setPeriod] = React.useState("7d")
  const [isSessionActive, setIsSessionActive] = React.useState(false)

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold text-foreground">
            Command Center
          </h1>
          <p className="text-muted-foreground">
            Real-time equity curve and discipline monitoring.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsSessionActive(!isSessionActive)}
            variant={isSessionActive ? "destructive" : "default"}
            className={cn(
              "font-bold transition-all duration-300",
              !isSessionActive && "bg-emerald-500 hover:bg-emerald-600 text-white"
            )}
          >
            {isSessionActive ? (
              <><Square className="w-4 h-4 mr-2 fill-current" /> Stop Session</>
            ) : (
              <><Play className="w-4 h-4 mr-2 fill-current" /> Start Session</>
            )}
          </Button>
          <Tabs value={period} onValueChange={setPeriod} className="bg-card/50 border border-white/5 p-1 rounded-lg">
            <TabsList className="bg-transparent">
              <TabsTrigger value="24h" className="data-[state=active]:bg-primary">24H</TabsTrigger>
              <TabsTrigger value="7d" className="data-[state=active]:bg-primary">7D</TabsTrigger>
              <TabsTrigger value="30d" className="data-[state=active]:bg-primary">30D</TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-primary">ALL</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Win Rate" 
          value="64.2%" 
          trend="+2.1%" 
          trendUp={true} 
          icon={<Target className="w-5 h-5 text-primary" />} 
        />
        <StatCard 
          title="Net PnL" 
          value="+$1,240.50" 
          trend="+$340 today" 
          trendUp={true} 
          icon={<TrendingUp className="w-5 h-5 text-accent" />} 
        />
        <StatCard 
          title="Daily MDD" 
          value="2.8%" 
          trend="Limit: 5.0%" 
          trendUp={false} 
          icon={<Activity className="w-5 h-5 text-destructive" />} 
        />
        <StatCard 
          title="Trade Freq" 
          value="14 / 20" 
          trend="Near cap" 
          trendUp={false} 
          icon={<Calendar className="w-5 h-5 text-orange-400" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-white/5 bg-card/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline text-xl">Equity Growth</CardTitle>
              <CardDescription>Visualizing your PnL over the selected period.</CardDescription>
            </div>
            <LayoutGrid className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[350px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                <YAxis hide />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="pnl" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPnl)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border-white/5 bg-card/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Discipline Heatmap</CardTitle>
              <CardDescription>Volume vs MDD Correlation</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="day" hide />
                  <RechartsTooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mdd" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
               <Zap className="w-8 h-8 text-primary/20 group-hover:text-primary transition-colors" />
            </div>
            <CardHeader>
              <CardTitle className="text-primary font-headline">AI Reality-Check</CardTitle>
              <CardDescription className="text-primary/70">Request a brutal data-driven critique of your current session.</CardDescription>
            </CardHeader>
            <CardContent>
               <FactBombModal />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, trend, trendUp, icon }: { title: string, value: string, trend: string, trendUp: boolean, icon: React.ReactNode }) {
  return (
    <Card className="border-white/5 bg-card/50 hover:bg-card/70 transition-colors duration-300">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="bg-white/5 p-3 rounded-2xl">
            {icon}
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
            trendUp ? "text-emerald-400 bg-emerald-500/10" : "text-destructive bg-destructive/10"
          )}>
            {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-headline font-bold mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  )
}
