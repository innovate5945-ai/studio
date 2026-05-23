'use server';

import { z } from 'zod';

const ProcessCsvSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().positive(),
});

export type CsvUploadResult =
  | {
      success: true;
      tradeCount: number;
      assetCount: number;
      fileName: string;
    }
  | { success: false; error: string };

// TODO: Replace with real CSV parsing + Firestore ingestion pipeline.
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
