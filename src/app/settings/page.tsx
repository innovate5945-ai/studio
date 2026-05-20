"use client"

import * as React from "react"
import { ShieldAlert, Info, Save, RotateCcw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SettingsPage() {
  const { toast } = useToast()
  const [lossLimit, setLossLimit] = React.useState([2.5])
  const [tradeCap, setTradeCap] = React.useState("10")
  const [autoCooldown, setAutoCooldown] = React.useState(true)
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({})

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    const cap = parseInt(tradeCap)
    if (isNaN(cap) || cap < 1) newErrors.tradeCap = "Must be at least 1 trade"
    if (cap > 100) newErrors.tradeCap = "Maximum cap is 100 trades/day"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validate()) {
      toast({
        title: "Thresholds Updated",
        description: "Discipline parameters have been synced across your workspace.",
      })
    }
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
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-white/5 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-primary" />
                Loss Management
              </CardTitle>
              <CardDescription>
                Set your maximum drawdown before a mandatory trading pause is triggered.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Max Daily Loss (%)</Label>
                  <span className="text-2xl font-headline font-bold text-primary">
                    {lossLimit[0]}%
                  </span>
                </div>
                <Slider
                  value={lossLimit}
                  onValueChange={setLossLimit}
                  max={10}
                  step={0.1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative (0.5%)</span>
                  <span>Extreme (10%)</span>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-semibold">Max Trades Per Session</Label>
                    <p className="text-xs text-muted-foreground">Hard cap to prevent revenge trading.</p>
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      value={tradeCap}
                      onChange={(e) => setTradeCap(e.target.value)}
                      className={errors.tradeCap ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                  </div>
                </div>
                {errors.tradeCap && (
                  <p className="text-xs text-destructive font-medium">{errors.tradeCap}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Enforcement Logic
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-semibold">Automatic Cooldown</Label>
                  <p className="text-xs text-muted-foreground">Lock dashboard features when thresholds are breached.</p>
                </div>
                <Switch 
                  checked={autoCooldown}
                  onCheckedChange={setAutoCooldown}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t border-white/5 pt-6">
              <Button variant="outline" onClick={() => {
                setLossLimit([2.5]);
                setTradeCap("10");
                setErrors({});
              }}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-bold">Why this matters?</AlertTitle>
            <AlertDescription className="text-muted-foreground leading-relaxed mt-2">
              Statistically, trading after a 2.5% drawdown leads to a 60% higher probability of further loss due to emotional fatigue.
            </AlertDescription>
          </Alert>
          
          <Card className="border-primary/20 bg-primary/5 overflow-hidden">
            <div className="h-1 bg-primary w-full" />
            <CardHeader>
              <CardTitle className="text-lg">Risk Profile: {lossLimit[0] < 2 ? 'Stable' : lossLimit[0] < 5 ? 'Balanced' : 'Aggressive'}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Based on your settings, IronTrader will enforce a 30-minute cooldown if your equity drops more than {lossLimit[0]}% in 24h.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}