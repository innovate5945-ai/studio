"use client"

import * as React from "react"
import { BarChart3, ChevronLeft, ChevronRight, Download, Filter, TrendingUp, TrendingDown, Target, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts"

const weeklyData = [
  { name: "Week 1", profit: 2400, loss: -1200, net: 1200 },
  { name: "Week 2", profit: 1800, loss: -2400, net: -600 },
  { name: "Week 3", profit: 4200, loss: -800, net: 3400 },
  { name: "Week 4", profit: 3100, loss: -1500, net: 1600 },
]

export default function ReportsPage() {
  const [view, setView] = React.useState("weekly")

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold text-foreground">
            Performance Reports
          </h1>
          <p className="text-muted-foreground text-lg">
            In-depth analysis of your trading discipline over time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/5 bg-card/50">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button className="bg-primary text-primary-foreground font-bold">
            Share Insights
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-white/5 bg-card/30">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Report Period</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={view} onValueChange={setView} className="w-full">
                <TabsList className="grid grid-cols-2 w-full bg-white/5 p-1">
                  <TabsTrigger value="weekly" className="data-[state=active]:bg-primary">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="data-[state=active]:bg-primary">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
                <span className="text-sm font-bold">October 2023</span>
                <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
              </div>

              <div className="pt-4 space-y-3">
                <FilterItem label="Asset Class" value="All Assets" />
                <FilterItem label="Strategy" value="Mean Reversion" />
                <FilterItem label="Status" value="Verified Only" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
               <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  Discipline Score
               </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-6">
               <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-primary animate-spin-slow" />
                  <span className="text-4xl font-headline font-bold text-primary">84</span>
               </div>
               <p className="text-xs text-center text-muted-foreground mt-4 leading-relaxed">
                  Your discipline improved by 12% compared to last month.
               </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <Card className="border-white/5 bg-card/30">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Net Profit Breakdown</CardTitle>
              <CardDescription>Visualizing revenue vs loss segments.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--white) / 0.05)'}}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                  <Bar dataKey="profit" name="Gross Profit" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="loss" name="Gross Loss" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReportStat 
              title="Profit Factor" 
              value="2.4" 
              desc="Health is excellent" 
              icon={<TrendingUp className="w-4 h-4 text-primary" />} 
            />
            <ReportStat 
              title="Win Rate" 
              value="58%" 
              desc="Down 2% vs prev" 
              icon={<Target className="w-4 h-4 text-accent" />} 
            />
            <ReportStat 
              title="Avg Holding" 
              value="42m" 
              desc="High intraday focus" 
              icon={<BarChart3 className="w-4 h-4 text-orange-400" />} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase text-muted-foreground">{label}</span>
      <Button variant="outline" className="justify-between border-white/5 bg-transparent h-9 text-xs">
        {value}
        <ChevronRight className="w-3 h-3 opacity-50" />
      </Button>
    </div>
  )
}

function ReportStat({ title, value, desc, icon }: { title: string, value: string, desc: string, icon: React.ReactNode }) {
  return (
    <Card className="border-white/5 bg-card/30">
      <CardContent className="p-5 space-y-3">
        <div className="bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
          <h3 className="text-2xl font-headline font-bold mt-1">{value}</h3>
          <p className="text-xs text-muted-foreground mt-1">{desc}</p>
        </div>
      </CardContent>
    </Card>
  )
}