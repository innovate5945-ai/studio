// @file src/app/(dashboard)/upload/page.tsx
import { CsvUploadZone } from "@/components/upload/csv-upload-zone"
import { PageHeader } from "@/components/layout/page-header"

export default function UploadPage() {
  return (
    <div className="page-shell mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Data Import"
        title="Import Trade History"
        description="Sync your broker history for AI-driven analysis. Supports MT4, MT5, and TradingView CSVs."
      />

      <CsvUploadZone />
    </div>
  )
}
