// @file src/__tests__/report-fixtures.test.ts
/**
 * @overview [UI-DASH-002] report-fixtures.test.ts — lib/report-fixtures 단위/통합 테스트.
 *
 * @call-flow
 * 1. render/mount lib/report-fixtures
 * 2. assert UI states + interactions
 */
import { getReportData, formatReportPnl } from '@/lib/report-fixtures';

describe('report-fixtures', () => {
  it('주간 리포트 데이터를 반환해야 합니다.', () => {
    const report = getReportData('weekly');

    expect(report.typeLabel).toBe('주간 리포트');
    expect(report.cards).toHaveLength(4);
    expect(report.analysisParagraphs.length).toBeGreaterThanOrEqual(2);
    expect(report.keyInsights[0]).toMatch(/59\.2%/);
  });

  it('월간 리포트 데이터를 반환해야 합니다.', () => {
    const report = getReportData('monthly');

    expect(report.typeLabel).toBe('월간 리포트');
    expect(report.cards).toHaveLength(3);
    expect(report.analysisParagraphs[0]).toMatch(/9,420,000원/);
  });

  it('주간/월간 리포트가 서로 다른 카드 목록을 제공해야 합니다.', () => {
    const weekly = getReportData('weekly');
    const monthly = getReportData('monthly');

    expect(weekly.cards[0]?.id).not.toBe(monthly.cards[0]?.id);
    expect(weekly.summaryTitle).not.toBe(monthly.summaryTitle);
  });

  it('순손익 포맷에 +/- 및 원 단위를 포함해야 합니다.', () => {
    expect(formatReportPnl(1600000)).toBe('+1,600,000원');
    expect(formatReportPnl(-600000)).toBe('-600,000원');
  });
});
