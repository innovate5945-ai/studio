// @file src/app/(dashboard)/system/page.tsx

"use client"

import * as React from "react"
import { Settings, Shield, Zap, Globe, Cpu, Database, Save, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function SystemPage() {
  const { toast } = useToast()
  
  const handleSave = () => {
    toast({
      title: "System Config Updated",
      description: "App synchronization and performance nodes updated.",
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-headline font-bold text-foreground">
          System Configuration
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage application infrastructure and integration nodes.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-white/5 bg-card/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Broker Integrations
              </CardTitle>
              <CardDescription>Configure real-time data sync with your trading platforms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center font-bold text-lg border border-white/5">TV</div>
                  <div>
                    <h4 className="font-bold">TradingView Hook</h4>
                    <p className="text-xs text-muted-foreground">Connected via Webhook Node-01</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-4 opacity-50">
                  <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center font-bold text-lg border border-white/5">MT5</div>
                  <div>
                    <h4 className="font-bold">MetaTrader 5</h4>
                    <p className="text-xs text-muted-foreground">Manual CSV Import Required</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-white/10">Connect</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-card/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-accent" />
                Performance & UI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-semibold">Low Latency Mode</Label>
                  <p className="text-xs text-muted-foreground">Prioritize real-time data streaming over UI animations.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-semibold">Cloud Sync Persistence</Label>
                  <p className="text-xs text-muted-foreground">Automatically backup session logs to IronTrader Cloud.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t border-white/5 pt-6">
              <Button variant="outline"><RotateCcw className="w-4 h-4 mr-2" /> Reset Defaults</Button>
              <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Save Config</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
               <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  System Health
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground">
                     <span>Node Stability</span>
                     <span className="text-primary">99.9%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-primary w-[99.9%]" />
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground">
                     <span>Sync Latency</span>
                     <span className="text-accent">14ms</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-accent w-[15%]" />
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-card/30">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="destructive" className="w-full justify-start text-xs font-bold">
                <Database className="w-4 h-4 mr-2" />
                Clear Local Cache
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs font-bold border-destructive/20 text-destructive hover:bg-destructive/10">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Discipline History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
