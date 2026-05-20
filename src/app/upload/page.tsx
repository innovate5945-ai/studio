"use client"

import * as React from "react"
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function UploadPage() {
  const { toast } = useToast()
  const [isDragging, setIsDragging] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [status, setStatus] = React.useState<'idle' | 'uploading' | 'error' | 'success'>('idle')
  const [errorMsg, setErrorMsg] = React.useState("")
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false)

  const handleFile = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const selectedFile = files[0]
    
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setStatus('error')
      setErrorMsg("Invalid format. Please upload a CSV file.")
      return
    }

    setFile(selectedFile)
    startUpload()
  }

  const startUpload = () => {
    setStatus('uploading')
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStatus('success')
          setShowSuccessDialog(true)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const reset = () => {
    setFile(null)
    setUploadProgress(0)
    setStatus('idle')
    setErrorMsg("")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-headline font-bold text-foreground">
          Import Trade History
        </h1>
        <p className="text-muted-foreground text-lg">
          Sync your broker history for AI-driven analysis. Supports MT4, MT5, and TradingView CSVs.
        </p>
      </header>

      <Card className="border-2 border-dashed border-white/10 bg-card/30">
        <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center space-y-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files); }}
            className={cn(
              "w-full max-w-xl aspect-[16/9] flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all duration-300",
              isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-white/10",
              status === 'uploading' && "pointer-events-none opacity-50"
            )}
          >
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <UploadCloud className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium">
              {file ? file.name : "Drag & drop your CSV here"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Maximum file size: 50MB
            </p>
            <Button
              variant="outline"
              className="mt-6 border-white/10 hover:bg-white/5"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Browse Files
            </Button>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".csv"
              onChange={(e) => handleFile(e.target.files)}
            />
          </div>

          {status === 'uploading' && (
            <div className="w-full max-w-xl space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  Analyzing patterns...
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {status === 'error' && (
            <div className="w-full max-w-xl p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-destructive">Upload Failed</p>
                <p className="text-sm text-muted-foreground">{errorMsg}</p>
              </div>
              <button onClick={reset}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Progressive Processing", desc: "Instantly chunking 10k+ rows for real-time validation.", icon: Loader2 },
          { title: "Auto-Deduplication", desc: "We won't import the same trade twice.", icon: CheckCircle2 },
          { title: "Risk Scan", desc: "Auto-identifying potential MDD breaches during import.", icon: AlertCircle },
        ].map((item) => (
          <div key={item.title} className="p-4 rounded-xl bg-card/50 border border-white/5 flex gap-4">
            <div className="bg-white/5 p-2 rounded-lg shrink-0 h-fit">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md bg-card border-white/5">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-center font-headline text-2xl">Import Successful</DialogTitle>
            <DialogDescription className="text-center">
              Your trade history has been ingested. We found <strong>142</strong> new trades across <strong>3</strong> assets.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button className="w-full" onClick={() => window.location.href = "/"}>
              View Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}