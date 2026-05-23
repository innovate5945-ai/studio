export const MAX_CSV_FILE_SIZE_MB = 50;

const ACCEPTED_EXTENSIONS = ['.csv'] as const;

const ACCEPTED_MIME_TYPES = new Set([
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
]);

export function isValidCsvFile(file: File): boolean {
  const lowerName = file.name.toLowerCase();
  const hasCsvExtension = ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  const hasCsvMime = file.type === '' || ACCEPTED_MIME_TYPES.has(file.type);

  return hasCsvExtension && hasCsvMime;
}

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
