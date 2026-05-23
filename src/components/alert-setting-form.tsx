"use client"

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

interface AlertSettingFormProps {
  isLoading?: boolean;
  isError?: boolean;
  onSave?: (data: { lossLimit: number; tradeCap: number }) => Promise<void> | void;
}

/**
 * @fileOverview [UI-ALERT-001] 알람 설정 화면 컴포넌트
 * 매매 기강을 위한 리스크 관리 기준(손실폭, 매매횟수)을 설정하는 폼입니다.
 */
export function AlertSettingForm({ isLoading, isError, onSave }: AlertSettingFormProps) {
  const { toast } = useToast()
  const [lossLimit, setLossLimit] = React.useState([5])
  const [tradeCap, setTradeCap] = React.useState("5")
  const [inputError, setInputError] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)

  // 매매 횟수 유효성 검사 로직
  const validate = (value: string) => {
    const num = parseInt(value)
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
      if (onSave) {
        await onSave({ lossLimit: lossLimit[0], tradeCap: parseInt(tradeCap) })
      }

      toast({
        title: "설정 저장 완료",
        description: "손실 제한 및 매매 횟수 설정이 성공적으로 반영되었습니다.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "저장 실패",
        description: "설정을 저장하는 중 오류가 발생했습니다.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 로딩 상태 (스켈레톤 UI)
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
      {/* 에러 상태 배너 */}
      {isError && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>서버 설정 로드 중 문제가 발생했습니다. 다시 시도해 주세요.</AlertDescription>
        </Alert>
      )}

      <Card className="border-white/5 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl">
        <CardHeader className="border-b border-white/5 bg-white/5">
          <CardTitle className="flex items-center gap-2 text-xl font-headline font-bold">
            <ShieldAlert className="w-5 h-5 text-primary" />
            알람 설정
          </CardTitle>
          <CardDescription>
            사용자의 매매 기강을 위한 리스크 관리 기준을 설정합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10 pt-8">
          {/* 1. 손실폭 설정 슬라이더 */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">손실폭 설정</Label>
              <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 shadow-inner">
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
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
              <span>최소 1%</span>
              <span>최대 20%</span>
            </div>
          </div>

          {/* 2. 매매횟수 상한 입력 */}
          <div className="space-y-4">
            <Label htmlFor="trade-cap" className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
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
                  "pr-12 h-14 text-lg bg-white/5 border-white/10 focus:ring-primary transition-all font-mono",
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
            {/* 인라인 에러 메시지 */}
            {inputError && (
              <p className="text-xs font-bold text-destructive flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-3 h-3" />
                {inputError}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-white/5 border-t border-white/5 p-6">
          <Button 
            onClick={handleSave} 
            disabled={hasValidationError || isSaving}
            className="w-full font-bold h-14 text-lg shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
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
