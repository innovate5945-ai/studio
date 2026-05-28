'use server';

// @file src/actions/csv-upload.ts
/**
 * @overview [UI-CSV-001] CSV 업로드 Server Action — 파일 메타 검증 후 mock 파싱 결과 반환.
 *
 * @call-flow
 * 1. CsvUploadZone — 클라이언트: getCsvValidationError (lib/csv-upload)
 * 2. CsvUploadZone — simulateUploadProgress → processCsvUpload({ fileName, fileSize })
 * 3. 성공 시 tradeCount/assetCount mock 반환
 *
 * @constraints "use server" — async function만 export. CsvUploadResult 타입은 lib/csv-upload.ts.
 * @see src/components/upload/csv-upload-zone.tsx
 */
import { z } from 'zod';
import type { CsvUploadResult } from '@/lib/csv-upload';

const ProcessCsvSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().positive(),
});

// TODO: Replace with real CSV parsing + Firestore ingestion pipeline.

/** CSV 파일 메타를 검증하고 mock ingest 결과를 반환합니다. */
export async function processCsvUpload(input: {
  fileName: string;
  fileSize: number;
}): Promise<CsvUploadResult> {
  const parsed = ProcessCsvSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? 'Invalid upload payload.',
    };
  }

  if (!parsed.data.fileName.toLowerCase().endsWith('.csv')) {
    return { success: false, error: 'CSV 파일만 처리할 수 있습니다.' };
  }

  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    success: true,
    tradeCount: 142,
    assetCount: 3,
    fileName: parsed.data.fileName,
  };
}
