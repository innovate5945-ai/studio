"use client"

// @file src/components/upload/csv-upload-zone.tsx
import * as React from "react"
import Link from "next/link"
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  getCsvValidationError,
  MAX_CSV_FILE_SIZE_MB,
  simulateUploadProgress,
  type CsvUploadSummary,
} from "@/lib/csv-upload"
import { processCsvUpload } from "@/actions/csv-upload"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type UploadStatus = "idle" | "uploading" | "error" | "success"

const FEATURE_ITEMS = [
  {
    title: "Progressive Processing",
    desc: "Instantly chunking 10k+ rows for real-time validation.",
    icon: Loader2,
  },
  {
    title: "Auto-Deduplication",
    desc: "We won't import the same trade twice.",
    icon: CheckCircle2,
  },
  {
    title: "Risk Scan",
    desc: "Auto-identifying potential MDD breaches during import.",
    icon: AlertCircle,
  },
] as const

/**
 * @fileOverview [UI-CSV-001] CSV 업로드 드래그 앤 드롭 영역
 * 점선 테두리, Drag Over 인터랙션, 프로그레스 시뮬레이션, 인라인 에러, 성공 모달 포함
 */
export function CsvUploadZone() {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const dragCounterRef = React.useRef(0)
  const cancelUploadRef = React.useRef<(() => void) | null>(null)

  const [isDragging, setIsDragging] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [status, setStatus] = React.useState<UploadStatus>("idle")
  const [errorMsg, setErrorMsg] = React.useState("")
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false)
  const [uploadSummary, setUploadSummary] = React.useState<CsvUploadSummary | null>(null)

  React.useEffect(() => {
    return () => {
      cancelUploadRef.current?.()
    }
  }, [])

  const reset = React.useCallback(() => {
    cancelUploadRef.current?.()
    cancelUploadRef.current = null
    setFile(null)
    setUploadProgress(0)
    setStatus("idle")
    setErrorMsg("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const handleInvalidFile = React.useCallback((message: string) => {
    cancelUploadRef.current?.()
    cancelUploadRef.current = null
    setFile(null)
    setUploadProgress(0)
    setStatus("error")
    setErrorMsg(message)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const startUpload = React.useCallback((selectedFile: File) => {
    cancelUploadRef.current?.()
    setFile(selectedFile)
    setStatus("uploading")
    setUploadProgress(0)
    setErrorMsg("")

    cancelUploadRef.current = simulateUploadProgress({
      onProgress: setUploadProgress,
      onComplete: async () => {
        const result = await processCsvUpload({
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
        })

        if (!result.success) {
          handleInvalidFile(result.error)
          return
        }

        setUploadSummary({
          tradeCount: result.tradeCount,
          assetCount: result.assetCount,
          fileName: result.fileName,
        })
        setStatus("success")
        setShowSuccessDialog(true)
      },
    })
  }, [handleInvalidFile])

  const handleFile = React.useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return

      const selectedFile = files[0]
      const validationError = getCsvValidationError(selectedFile)

      if (validationError) {
        handleInvalidFile(validationError)
        return
      }

      startUpload(selectedFile)
    },
    [handleInvalidFile, startUpload]
  )

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    dragCounterRef.current += 1
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    dragCounterRef.current -= 1
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0
      setIsDragging(false)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    dragCounterRef.current = 0
    setIsDragging(false)
    handleFile(event.dataTransfer.files)
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleSuccessClose = (open: boolean) => {
    setShowSuccessDialog(open)
    if (!open) {
      reset()
    }
  }

  return (
    <div className="space-y-8">
      <Card className="border-white/5 bg-card/50 backdrop-blur-md">
        <CardContent className="pt-8 pb-8 px-4 sm:px-8 flex flex-col items-center">
          <div
            data-testid="csv-drop-zone"
            role="button"
            tabIndex={0}
            aria-label="CSV 파일 드래그 앤 드롭 영역"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                handleBrowseClick()
              }
            }}
            className={cn(
              "w-full max-w-xl min-h-[220px] sm:min-h-[260px] flex flex-col items-center justify-center",
              "border-2 border-dashed rounded-2xl transition-all duration-300 px-4 py-10",
              isDragging
                ? "border-primary bg-primary/10 scale-[1.01] shadow-lg shadow-primary/10"
                : "border-white/10 bg-card/30 hover:border-white/20",
              status === "uploading" && "pointer-events-none opacity-80"
            )}
          >
            <div
              className={cn(
                "p-4 rounded-full mb-4 transition-colors",
                isDragging ? "bg-primary/20" : "bg-primary/10"
              )}
            >
              <UploadCloud
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 transition-colors",
                  isDragging ? "text-primary" : "text-primary/80"
                )}
              />
            </div>

            <p className="text-base sm:text-lg font-medium text-center break-all px-2">
              {file ? file.name : "CSV 파일을 여기에 드래그하세요"}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">
              MT4, MT5, TradingView CSV · 최대 {MAX_CSV_FILE_SIZE_MB}MB
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-6 w-full sm:w-auto border-white/10 hover:bg-white/5"
              disabled={status === "uploading"}
              onClick={handleBrowseClick}
            >
              파일 선택
            </Button>

            <input
              ref={fileInputRef}
              data-testid="csv-file-input"
              type="file"
              className="hidden"
              accept=".csv,text/csv"
              onChange={(event) => handleFile(event.target.files)}
            />
          </div>

          {status === "uploading" && (
            <div
              data-testid="csv-upload-progress"
              className="w-full max-w-xl space-y-3 mt-6"
            >
              <div className="flex justify-between text-sm font-medium gap-4">
                <span className="flex items-center gap-2 min-w-0">
                  <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                  <span className="truncate">거래 내역 분석 중...</span>
                </span>
                <span className="shrink-0">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {status === "error" && (
            <div
              data-testid="csv-upload-error"
              className="w-full max-w-xl mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-destructive">업로드 실패</p>
                <p className="text-sm text-muted-foreground break-words">{errorMsg}</p>
              </div>
              <button
                type="button"
                onClick={reset}
                aria-label="에러 닫기"
                className="shrink-0 p-1 hover:bg-white/5 rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {FEATURE_ITEMS.map((item) => (
          <div
            key={item.title}
            className="p-4 rounded-xl bg-card/50 border border-white/5 flex gap-4"
          >
            <div className="bg-white/5 p-2 rounded-lg shrink-0 h-fit">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-1 min-w-0">
              <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={handleSuccessClose}>
        <DialogContent
          data-testid="csv-success-dialog"
          className="sm:max-w-md bg-card border-white/5 mx-4"
        >
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-center font-headline text-2xl">
              Import Successful
            </DialogTitle>
            <DialogDescription className="text-center leading-relaxed">
              <strong>{uploadSummary?.fileName}</strong> 파일이 처리되었습니다.
              <br />
              <strong>{uploadSummary?.tradeCount ?? 0}</strong>건의 거래와{" "}
              <strong>{uploadSummary?.assetCount ?? 0}</strong>개 자산이 추가되었습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button className="w-full" asChild>
              <Link href="/">View Dashboard</Link>
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSuccessClose(false)}>
              Upload Another
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
