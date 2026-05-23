import { CsvUploadZone } from "@/components/upload/csv-upload-zone"

export default function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground">
          Import Trade History
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Sync your broker history for AI-driven analysis. Supports MT4, MT5, and TradingView CSVs.
        </p>
      </header>

      <CsvUploadZone />
    </div>
  )
}
