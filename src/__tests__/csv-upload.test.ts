// @file src/__tests__/csv-upload.test.ts
/**
 * @overview [UI-CSV-001] csv-upload.test.ts — lib/csv-upload + actions/csv-upload 단위/통합 테스트.
 *
 * @call-flow
 * 1. render/mount lib/csv-upload + actions/csv-upload
 * 2. assert UI states + interactions
 */
import {
  getCsvValidationError,
  isValidCsvFile,
  simulateUploadProgress,
} from '@/lib/csv-upload';

describe('csv-upload utilities', () => {
  describe('isValidCsvFile', () => {
    it('CSV 파일을 유효한 것으로 판단해야 합니다.', () => {
      const file = new File(['date,symbol'], 'trades.csv', { type: 'text/csv' });
      expect(isValidCsvFile(file)).toBe(true);
    });

    it('xlsx 파일을 거부해야 합니다.', () => {
      const file = new File(['binary'], 'report.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      expect(isValidCsvFile(file)).toBe(false);
    });
  });

  describe('getCsvValidationError', () => {
    it('xlsx 업로드 시 Excel 관련 인라인 에러 메시지를 반환해야 합니다.', () => {
      const file = new File(['binary'], 'report.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      expect(getCsvValidationError(file)).toMatch(/Excel 파일\(\.xlsx\)/);
    });

    it('CSV 파일이면 null을 반환해야 합니다.', () => {
      const file = new File(['date,symbol'], 'trades.csv', { type: 'text/csv' });
      expect(getCsvValidationError(file)).toBeNull();
    });
  });

  describe('simulateUploadProgress', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('프로그레스를 단계적으로 올리고 완료 콜백을 호출해야 합니다.', () => {
      const onProgress = jest.fn();
      const onComplete = jest.fn();

      simulateUploadProgress({ onProgress, onComplete, intervalMs: 200, step: 50 });

      jest.advanceTimersByTime(200);
      expect(onProgress).toHaveBeenCalledWith(50);

      jest.advanceTimersByTime(200);
      expect(onProgress).toHaveBeenCalledWith(100);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });
});
