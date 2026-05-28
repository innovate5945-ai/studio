// @file src/app/(dashboard)/upload/page.tsx
/**
 * @overview [UI-CSV-001] CSV Import 페이지 — 거래 내역 업로드.
 *
 * @call-flow
 * 1. /upload → PageHeader + CsvUploadZone
 * 2. DnD/file pick → getCsvValidationError → processCsvUpload
 * 3. 성공 Dialog — tradeCount / assetCount mock 결과
 *
 * @see src/components/upload/csv-upload-zone.tsx, src/lib/csv-upload.ts, src/actions/csv-upload.ts
 */
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
