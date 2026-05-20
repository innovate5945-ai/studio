"use client"

import * as React from "react"
import { Calendar, Search, Filter, TrendingUp, TrendingDown, Clock, Eye, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"

const trades = [
  { id: 1, asset: "BTC/USDT", date: "2023-10-24 14:20", side: "Long", pnl: "+$420.50", status: "Win", sentiment: "Confident", duration: "45m" },
  { id: 2, asset: "AAPL", date: "2023-10-24 10:15", side: "Short", pnl: "-$150.20", status: "Loss", sentiment: "Anxious", duration: "2h 10m" },
  { id: 3, asset: "ETH/USDT", date: "2023-10-23 22:45", side: "Long", pnl: "+$890.00", status: "Win", sentiment: "Disciplined", duration: "12m" },
  { id: 4, asset: "TSLA", date: "2023-10-23 16:30", side: "Short", pnl: "-$540.00", status: "Loss", sentiment: "Impulsive", duration: "5m" },
  { id: 5, asset: "GLD", date: "2023-10-23 09:00", side: "Long", pnl: "+$120.00", status: "Win", sentiment: "Neutral", duration: "4h" },
]

export default function ReviewPage() {
  const [searchTerm, setSearchTerm] = React.useState("")

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold text-foreground">
            Snap-Scan Trade Logs
          </h1>
          <p className="text-muted-foreground text-lg">
            Rapid 3-minute review cycle for your recent trade executions.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search assets..." 
              className="pl-9 bg-card/50 border-white/5" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="border-white/5 bg-card/50">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {trades.map((trade) => (
          <Link key={trade.id} href={`/review/${trade.id}`}>
            <Card className="border-white/5 bg-card/30 hover:bg-card/50 hover:border-primary/20 transition-all group overflow-hidden">
              <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
                <div className={cn(
                  "w-1 md:w-2 shrink-0",
                  trade.status === 'Win' ? "bg-primary" : "bg-destructive"
                )} />
                <div className="flex-1 p-5 grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Asset</p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{trade.asset}</span>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">{trade.side}</Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Result</p>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-lg font-headline font-bold",
                        trade.status === 'Win' ? "text-primary" : "text-destructive"
                      )}>
                        {trade.pnl}
                      </span>
                      {trade.status === 'Win' ? <TrendingUp className="w-4 h-4 text-primary" /> : <TrendingDown className="w-4 h-4 text-destructive" />}
                    </div>
                  </div>

                  <div className="space-y-1 hidden md:block">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Psychology</p>
                    <Badge className={cn(
                      "font-bold",
                      trade.sentiment === 'Impulsive' ? 'bg-orange-500/20 text-orange-400 border-orange-500/20' : 
                      trade.sentiment === 'Anxious' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' : 
                      'bg-primary/20 text-primary border-primary/20'
                    )}>
                      {trade.sentiment}
                    </Badge>
                  </div>

                  <div className="space-y-1 hidden md:block">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Execution</p>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {trade.duration}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pr-4">
                     <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <MessageSquare className="w-4 h-4" />
                     </Button>
                     <Button variant="secondary" size="icon" className="rounded-full">
                        <Eye className="w-4 h-4" />
                     </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="flex items-center justify-center pt-8">
        <Button variant="ghost" className="text-muted-foreground hover:text-primary">
          Load Previous Session
        </Button>
      </div>
    </div>
  )
}
