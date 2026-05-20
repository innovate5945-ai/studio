
"use client"

import * as React from "react"
import { History, ShieldAlert, Info, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const auditLogs = [
  { id: 1, timestamp: "2023-10-25 14:30:05", event: "Threshold Breach", description: "Max Daily Drawdown (2.8%) exceeded limit (2.5%)", severity: "Critical", actor: "System" },
  { id: 2, timestamp: "2023-10-25 14:30:06", event: "Auto-Enforcement", description: "Mandatory 30-minute cooldown initiated", severity: "High", actor: "GuardNode" },
  { id: 3, timestamp: "2023-10-24 09:15:00", event: "Settings Update", description: "Risk cap adjusted from 2.0% to 2.5%", severity: "Info", actor: "User" },
  { id: 4, timestamp: "2023-10-23 22:45:12", event: "Session Start", description: "Active monitoring session initiated for ETH/USDT", severity: "Info", actor: "User" },
  { id: 5, timestamp: "2023-10-23 16:30:00", event: "Discipline Warning", description: "Trade frequency reaching daily limit (18/20)", severity: "Medium", actor: "System" },
]

export default function AuditPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-headline font-bold text-foreground">
          Audit Trail
        </h1>
        <p className="text-muted-foreground text-lg">
          Immutable history of discipline breaches and system enforcements.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-white/5 bg-card/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-headline">Enforcement Log</CardTitle>
              <CardDescription>Comprehensive record of all system and user activities.</CardDescription>
            </div>
            <History className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5">
                  <TableHead className="w-[200px]">Timestamp</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Actor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {log.timestamp}
                    </TableCell>
                    <TableCell className="font-bold">
                      {log.event}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {log.description}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "font-bold uppercase text-[10px]",
                          log.severity === 'Critical' ? 'border-destructive text-destructive bg-destructive/10' :
                          log.severity === 'High' ? 'border-orange-500 text-orange-500 bg-orange-500/10' :
                          log.severity === 'Medium' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' :
                          'border-primary text-primary bg-primary/10'
                        )}
                      >
                        {log.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {log.actor}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-white/5 bg-card/50">
            <CardContent className="pt-6 flex items-start gap-4">
               <div className="p-3 bg-destructive/10 rounded-xl">
                  <ShieldAlert className="w-6 h-6 text-destructive" />
               </div>
               <div>
                  <h4 className="text-sm font-bold">Critical Breaches</h4>
                  <p className="text-2xl font-headline font-bold mt-1">12</p>
                  <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
               </div>
            </CardContent>
          </Card>
          <Card className="border-white/5 bg-card/50">
            <CardContent className="pt-6 flex items-start gap-4">
               <div className="p-3 bg-yellow-500/10 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
               </div>
               <div>
                  <h4 className="text-sm font-bold">Warnings Issued</h4>
                  <p className="text-2xl font-headline font-bold mt-1">45</p>
                  <p className="text-xs text-muted-foreground mt-1">System automated</p>
               </div>
            </CardContent>
          </Card>
          <Card className="border-white/5 bg-card/50">
            <CardContent className="pt-6 flex items-start gap-4">
               <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
               </div>
               <div>
                  <h4 className="text-sm font-bold">Compliance Rate</h4>
                  <p className="text-2xl font-headline font-bold mt-1">94.2%</p>
                  <p className="text-xs text-muted-foreground mt-1">+2.4% vs prev</p>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
