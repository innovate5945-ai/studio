"use client"

// @file src/components/alert-setting-form.tsx
/**
 * @overview [UI-ALERT-001] 알람 설정 폼 — 손실폭 슬라이더·매매횟수 상한 입력·저장.
 *
 * @call-flow
 * 1. settings/page → getAlertSettings → defaultValues props
 * 2. Slider(lossLimit) + Input(tradeCap) — 클라이언트 validate
 * 3. 저장 → saveAlertSettings(input) → toast 성공/실패 피드백
 *
 * @see src/actions/alert-settings.ts, src/lib/alert-settings.ts, src/app/(dashboard)/settings/page.tsx
 */
import * as React from "react"
import { ShieldAlert, Save, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { saveAlertSettings } from "@/actions/alert-settings"
import { type AlertSettingsInput } from "@/lib/alert-settings"

interface AlertSettingFormProps {
  defaultValues?: AlertSettingsInput
  isLoading?: boolean
  isError?: boolean
}


/** 손실 한도·매매 횟수 알람 임계값을 편집·저장하는 설정 폼. */
export function AlertSettingForm({
  defaultValues = { lossLimit: 5, tradeCap: 5 },
  isLoading,
  isError,
}: AlertSettingFormProps) {
  const { toast } = useToast()
  const [lossLimit, setLossLimit] = React.useState([defaultValues.lossLimit])
  const [tradeCap, setTradeCap] = React.useState(String(defaultValues.tradeCap))
  const [inputError, setInputError] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)

  React.useEffect(() => {
    setLossLimit([defaultValues.lossLimit])
    setTradeCap(String(defaultValues.tradeCap))
    setInputError("")
  }, [defaultValues.lossLimit, defaultValues.tradeCap])

  const validate = (value: string) => {
    const num = parseInt(value, 10)
    if (value.trim() === "" || isNaN(num) || num < 1) {
      setInputError("⚠ 매매 횟수는 최소 1회 이상 입력해야 합니다.")
      return false
    }
    setInputError("")
    return true
  }

  const handleTradeCapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTradeCap(val)
    validate(val)
  }

  const handleSave = async () => {
    if (!validate(tradeCap)) return

    setIsSaving(true)
    try {
      const result = await saveAlertSettings({
        lossLimit: lossLimit[0],
        tradeCap: parseInt(tradeCap, 10),
      })

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
        return
      }

      toast({
        title: "Success",
        description: "설정이 성공적으로 저장되었습니다.",
      })
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "설정을 저장하는 중 오류가 발생했습니다.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="border-white/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    )
  }

  const hasValidationError = !!inputError || tradeCap.trim() === ""

  return (
    <div className="space-y-6">
      {isError && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>서버 설정 로드 중 문제가 발생했습니다. 다시 시도해 주세요.</AlertDescription>
        </Alert>
      )}

      <Card className="surface-card-muted shadow-xl">
        <CardHeader className="border-b border-white/5 bg-white/5">
          <CardTitle className="flex items-center gap-2 font-headline text-lg font-semibold sm:text-xl">
            <ShieldAlert className="h-5 w-5 text-primary" />
            알람 설정
          </CardTitle>
          <CardDescription className="max-w-prose leading-relaxed">
            리스크 관리 기준을 설정하여 심리적 매매 편향을 방지합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10 pt-8">
          <div className="space-y-5">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <Label className="eyebrow">손실폭 설정</Label>
              <span className="inline-flex w-fit items-center rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                현재 설정: 당일 -{lossLimit[0]}% 손실 시 제한
              </span>
            </div>
            <Slider
              value={lossLimit}
              onValueChange={setLossLimit}
              min={1}
              max={20}
              step={1}
              className="py-2"
              aria-label="손실폭 설정 슬라이더"
            />
            <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              <span>최소 1%</span>
              <span>최대 20%</span>
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="trade-cap" className="eyebrow">
              매매횟수 상한
            </Label>
            <div className="relative group">
              <Input
                id="trade-cap"
                type="number"
                value={tradeCap}
                onChange={handleTradeCapChange}
                placeholder="5"
                className={cn(
                  "pr-12 h-14 text-lg bg-white/5 border-white/10 transition-all",
                  inputError && "border-destructive focus:ring-destructive text-destructive"
                )}
                aria-label="매매횟수 상한 입력"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-l border-white/10 pl-4 h-2/3">
                <span className="text-sm font-bold text-muted-foreground group-focus-within:text-primary transition-colors">
                  회
                </span>
              </div>
            </div>
            {inputError && (
              <p className="flex items-center gap-1.5 text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {inputError}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-white/5 border-t border-white/5 p-6">
          <Button
            onClick={handleSave}
            disabled={hasValidationError || isSaving}
            className="w-full font-bold h-14 text-lg shadow-lg shadow-primary/20 transition-all"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                설정 저장
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
