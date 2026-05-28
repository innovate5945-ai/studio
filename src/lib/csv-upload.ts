// @file src/lib/csv-upload.ts
/**
 * @overview [UI-CSV-001] CSV 클라이언트 검증·업로드 progress 시뮬레이션·CsvUploadResult 타입.
 *
 * @call-flow
 * 1. CsvUploadZone → getCsvValidationError(file) — 형식/크기 검증
 * 2. simulateUploadProgress — UI progress bar
 * 3. processCsvUpload (actions/csv-upload.ts) — 서버 mock ingest
 *
 * @see src/components/upload/csv-upload-zone.tsx, src/actions/csv-upload.ts
 */
/** CSV 업로드 허용 최대 파일 크기 (MB) */
export const MAX_CSV_FILE_SIZE_MB = 50;

const ACCEPTED_EXTENSIONS = ['.csv'] as const;

const ACCEPTED_MIME_TYPES = new Set([
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
]);

/** CSV 확장자·MIME 타입이 유효한지 확인합니다. */
export function isValidCsvFile(file: File): boolean {
  const lowerName = file.name.toLowerCase();
  const hasCsvExtension = ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  const hasCsvMime = file.type === '' || ACCEPTED_MIME_TYPES.has(file.type);

  return hasCsvExtension && hasCsvMime;
}

/** 파일 형식·크기 오류 메시지를 반환합니다. 유효하면 null. */
export function getCsvValidationError(file: File): string | null {
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
    return `Excel 파일(.xlsx)은 지원하지 않습니다. CSV 형식으로 내보낸 후 업로드해 주세요.`;
  }

  if (!isValidCsvFile(file)) {
    return `지원하지 않는 파일 형식입니다. CSV 파일만 업로드할 수 있습니다. (현재: ${file.name})`;
  }

  const maxBytes = MAX_CSV_FILE_SIZE_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `파일 크기는 ${MAX_CSV_FILE_SIZE_MB}MB 이하여야 합니다.`;
  }

  return null;
}

export type UploadSimulationOptions = {
  onProgress: (value: number) => void;
  onComplete: () => void;
  intervalMs?: number;
  step?: number;
};

/** 클라이언트 업로드 progress bar 시뮬레이션. cleanup 함수를 반환합니다. */
export function simulateUploadProgress({
  onProgress,
  onComplete,
  intervalMs = 200,
  step = 10,
}: UploadSimulationOptions): () => void {
  let progress = 0;

  const intervalId = window.setInterval(() => {
    progress = Math.min(100, progress + step);

    if (progress >= 100) {
      window.clearInterval(intervalId);
      onProgress(100);
      onComplete();
      return;
    }

    onProgress(progress);
  }, intervalMs);

  return () => window.clearInterval(intervalId);
}

export type CsvUploadSummary = {
  tradeCount: number;
  assetCount: number;
  fileName: string;
};

export type CsvUploadResult =
  | {
      success: true;
      tradeCount: number;
      assetCount: number;
      fileName: string;
    }
  | { success: false; error: string };
