#!/usr/bin/env node
/**
 * @file scripts/enrich-file-headers.mjs
 *
 * @overview
 * `studio/src/` 전수 조사 후 `@file`/`@overview`/`@call-flow` JSDoc을
 * 삽입·교체·완성도 검증합니다. META 레지스트리로 Task별 call-flow를
 * seed하고, shadcn ui·__tests__는 별도 규칙을 적용합니다.
 *
 * @audience
 * - **개발자**: add-file-headers.mjs 2단계 — 신규 모듈 bulk annotation
 * - **AI 에이전트**: CODE_INDEX 보완 — 파일별 역할·호출 흐름 자동 생성
 *
 * @usage
 * ```bash
 * cd studio
 * node scripts/enrich-file-headers.mjs
 * ```
 *
 * @behavior
 * 1. `src/**/*.{ts,tsx,css}` walk
 * 2. `@overview` 없거나 malformed → stripHeaderBlocks → ensureFileLine → insertJsdoc
 * 3. META[rel] hit → Task-specific overview/call-flow
 * 4. ui/* → skipCallFlow, tests → TEST_META template
 * 5. CRLF-safe regex (Windows)
 *
 * @outputs stdout — `✓ src/...`, `Updated: N | Skipped (complete): M`
 *
 * @caution
 * - greedy strip 시 import 삭제 위험 — META 완비 후 feature 파일은 수동 polish 권장
 * - `@fileOverview` 레거시는 remove-fileoverview.mjs 선행 실행
 *
 * @see docs/CODE_ANNOTATION_GUIDE.md, scripts/add-file-headers.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'src');

/** @type {Record<string, { overview: string; callFlow?: string; skipCallFlow?: boolean }>} */
const META = {
  'src/actions/alert-settings.ts': {
    overview: '[UI-ALERT-001] 알람 설정 Server Actions — 손실폭·매매횟수 임계값 조회/저장 (in-memory mock).',
    callFlow: '1. SettingsPage → getAlertSettings()\n2. AlertSettingForm → saveAlertSettings → AlertSettingsSchema.safeParse',
  },
  'src/actions/discipline-cooldown.ts': {
    overview: '[UI-ALERT-002] 규율 쿨타임 Server Actions — 위반 시 30분 강제 휴식 (in-memory mock).',
    callFlow: '1. DisciplineProvider.bootstrap → getDisciplineCooldown()\n2. evaluateDisciplineBreach → startDisciplineCooldown → CooldownBanner',
  },
  'src/actions/auth.ts': {
    overview: '[UI-AUTH-001] 인증 Server Actions — 로그인/회원가입 mock.',
    callFlow: '1. LoginForm → loginUser → loginSchema.safeParse\n2. RegisterForm → registerUser → registerSchema.safeParse',
  },
  'src/actions/csv-upload.ts': {
    overview: '[UI-CSV-001] CSV 업로드 Server Action — 메타 검증 후 mock ingest.',
    callFlow: '1. CsvUploadZone → getCsvValidationError (lib)\n2. processCsvUpload({ fileName, fileSize })',
  },
  'src/lib/alert-settings.ts': {
    overview: '[UI-ALERT-001] 알람 설정 Zod 스키마·타입·기본값.',
    callFlow: 'actions/alert-settings → AlertSettingsSchema.safeParse',
  },
  'src/lib/discipline-cooldown.ts': {
    overview: '[UI-ALERT-002] 쿨타임 타입·Zod 스키마·상수.',
    callFlow: 'startDisciplineCooldown → StartCooldownSchema.safeParse',
  },
  'src/lib/discipline.ts': {
    overview: '[UI-ALERT-002] breach 평가·쿨타임 포맷·localStorage.',
    callFlow: '1. evaluateDisciplineBreach(metrics, settings)\n2. writeStoredCooldown / formatCooldownTime',
  },
  'src/lib/auth-validation.ts': {
    overview: '[UI-AUTH-001] 로그인/회원가입 Zod 스키마·AuthResult.',
    callFlow: 'LoginForm/RegisterForm → actions/auth → safeParse',
  },
  'src/lib/csv-upload.ts': {
    overview: '[UI-CSV-001] CSV 클라이언트 검증·progress·CsvUploadResult.',
    callFlow: 'CsvUploadZone → getCsvValidationError → processCsvUpload',
  },
  'src/lib/dashboard-fixtures.ts': {
    overview: '[UI-DASH-001] 대시보드 차트 mock·포맷 헬퍼.',
    callFlow: 'DashboardAnalytics → getDashboardData(period)',
  },
  'src/lib/report-fixtures.ts': {
    overview: '[UI-DASH-002] 주간/월간 리포트 mock.',
    callFlow: 'ReportsView → getReportData(reportType)',
  },
  'src/lib/review-fixtures.ts': {
    overview: '[UI-REVIEW-001] 복기 일지 목록 mock.',
    callFlow: 'ReviewsView → getReviewJournals() → ReviewJournalList',
  },
  'src/lib/review-detail-fixtures.ts': {
    overview: '[UI-REVIEW-002] 복기 상세 mock (차트·인사이트).',
    callFlow: 'review/[id]/page → getReviewDetail(id) → ReviewDetailView',
  },
  'src/lib/utils.ts': {
    overview: 'Tailwind className merge (clsx + tailwind-merge).',
    callFlow: 'cn(...inputs) — 컴포넌트 className 병합',
  },
  'src/lib/placeholder-images.ts': {
    overview: 'Placeholder 이미지 URL 헬퍼.',
    callFlow: 'getPlaceholderImage(id) — mock 이미지 조회',
  },
  'src/contexts/discipline-provider.tsx': {
    overview: '[UI-ALERT-002] 전역 규율 상태 — settings, session, cooldown, Fact-Bomb.',
    callFlow: '1. bootstrap: getAlertSettings ∥ getDisciplineCooldown\n2. evaluateDisciplineBreach → startDisciplineCooldown\n3. CooldownBanner ← useDiscipline()',
  },
  'src/ai/genkit.ts': {
    overview: 'Genkit 인스턴스·Gemini 2.5 Flash 모델 설정.',
    callFlow: 'ai/flows/* → genkit.model("googleai/gemini-2.5-flash")',
  },
  'src/ai/dev.ts': {
    overview: 'Genkit dev CLI 진입점 (npm run genkit:dev).',
    callFlow: 'genkit start → ai/flows 등록',
  },
  'src/ai/flows/ai-reality-check-fact-bomb.ts': {
    overview: 'AI Reality-Check Fact-Bomb Genkit Flow — Gemini 매매 심리 분석.',
    callFlow: 'FactBombModal → aiRealityCheckFactBomb(input) → Gemini response',
  },
  'src/app/layout.tsx': {
    overview: 'Root Layout — fonts, DisciplineProvider, Toaster.',
    callFlow: 'layout → DisciplineProvider → route groups',
  },
  'src/app/(dashboard)/layout.tsx': {
    overview: 'Dashboard Layout — Sidebar, CooldownBanner, FactBombModal.',
    callFlow: 'AppSidebar + CooldownBanner + {children}',
  },
  'src/app/(dashboard)/page.tsx': {
    overview: 'Command Center (/) — Live Session, Analytics, Fact-Bomb.',
    callFlow: 'useDiscipline → recordTrade/addLoss → DashboardAnalytics',
  },
  'src/app/(auth)/layout.tsx': {
    overview: 'Auth route group shell — 사이드바 없음.',
    callFlow: '{children} — login/register pages',
  },
  'src/app/(auth)/login/page.tsx': {
    overview: '[UI-AUTH-001] 로그인 페이지.',
    callFlow: 'page → LoginForm → loginUser (actions/auth)',
  },
  'src/app/(auth)/register/page.tsx': {
    overview: '[UI-AUTH-001] 회원가입 페이지.',
    callFlow: 'page → RegisterForm → registerUser (actions/auth)',
  },
  'src/app/(dashboard)/settings/page.tsx': {
    overview: '[UI-ALERT-001] Discipline Thresholds 설정 페이지.',
    callFlow: 'getAlertSettings → AlertSettingForm → saveAlertSettings',
  },
  'src/app/(dashboard)/upload/page.tsx': {
    overview: '[UI-CSV-001] CSV Import 페이지.',
    callFlow: 'page → CsvUploadZone → processCsvUpload',
  },
  'src/app/(dashboard)/reviews/page.tsx': {
    overview: '[UI-REVIEW-001] Trade Logs 목록 페이지.',
    callFlow: 'page → ReviewsView → getReviewJournals',
  },
  'src/app/(dashboard)/review/page.tsx': {
    overview: '복기 일지 리다이렉트 (/review → /reviews).',
    callFlow: 'redirect("/reviews")',
  },
  'src/app/(dashboard)/review/[id]/page.tsx': {
    overview: '[UI-REVIEW-002] 복기 일지 상세 페이지.',
    callFlow: 'params.id → ReviewDetailView → getReviewDetail',
  },
  'src/app/(dashboard)/reports/page.tsx': {
    overview: '[UI-DASH-002] Performance Reports 페이지.',
    callFlow: 'page → ReportsView → getReportData',
  },
  'src/app/(dashboard)/audit/page.tsx': {
    overview: 'Audit Trail mock 페이지 — 규율 위반·설정 변경 이력.',
    callFlow: 'inline mock table render',
  },
  'src/app/(dashboard)/system/page.tsx': {
    overview: 'System Settings mock 페이지.',
    callFlow: 'inline mock toggles render',
  },
  'src/app/globals.css': {
    overview: 'Tailwind base + IronTrader 디자인 토큰 + @layer components 타이포.',
    callFlow: 'globals.css → page-shell, page-title, eyebrow 등 유틸',
  },
  'src/components/layout/app-sidebar.tsx': {
    overview: '대시보드 사이드바 네비게이션.',
    callFlow: 'mainNav/adminNav → Link → dashboard routes',
  },
  'src/components/layout/page-header.tsx': {
    overview: '페이지 제목·설명·액션 공통 헤더.',
    callFlow: 'PageHeader(title, description, actions) — page-shell 내 사용',
  },
  'src/components/alert-setting-form.tsx': {
    overview: '[UI-ALERT-001] 알람 설정 폼 — 손실폭 슬라이더·매매횟수 상한.',
    callFlow: 'saveAlertSettings(input) → toast feedback',
  },
  'src/components/dashboard/cooldown-banner.tsx': {
    overview: '[UI-ALERT-002] 쿨타임 sticky 배너.',
    callFlow: 'useDiscipline().cooldown → formatCooldownTime(timeLeft)',
  },
  'src/components/dashboard/dashboard-analytics.tsx': {
    overview: '[UI-DASH-001] 승률·MDD·매매횟수 차트 섹션.',
    callFlow: 'getDashboardData(period) → SummaryMetric + charts',
  },
  'src/components/dashboard/period-filter.tsx': {
    overview: '[UI-DASH-001] 기간 필터 (1w/1m/3m).',
    callFlow: 'PeriodFilter value/onChange → DashboardAnalytics',
  },
  'src/components/dashboard/win-rate-donut-chart.tsx': {
    overview: '[UI-DASH-001] 승률 도넛 차트.',
    callFlow: 'props(winRate, winCount, lossCount) → Recharts',
  },
  'src/components/dashboard/mdd-line-chart.tsx': {
    overview: '[UI-DASH-001] MDD 라인 차트.',
    callFlow: 'props(mddSeries, maxMdd) → Recharts',
  },
  'src/components/dashboard/trade-count-bar-chart.tsx': {
    overview: '[UI-DASH-001] 매매 횟수 바 차트.',
    callFlow: 'props(tradeSeries, totalTrades) → Recharts',
  },
  'src/components/ai/fact-bomb-modal.tsx': {
    overview: '[UI-ALERT-002] AI Fact-Bomb 모달 — Gemini Reality-Check.',
    callFlow: 'aiRealityCheckFactBomb flow → modal display',
  },
  'src/components/auth/auth-form-layout.tsx': {
    overview: '[UI-AUTH-001] 인증 페이지 공통 레이아웃.',
    callFlow: 'AuthFormLayout → Card → {children}',
  },
  'src/components/auth/login-form.tsx': {
    overview: '[UI-AUTH-001] 로그인 폼.',
    callFlow: 'react-hook-form → loginUser → router.push',
  },
  'src/components/auth/register-form.tsx': {
    overview: '[UI-AUTH-001] 회원가입 폼.',
    callFlow: 'react-hook-form → registerUser → router.push',
  },
  'src/components/upload/csv-upload-zone.tsx': {
    overview: '[UI-CSV-001] CSV DnD 업로드 존.',
    callFlow: 'getCsvValidationError → simulateUploadProgress → processCsvUpload',
  },
  'src/components/reports/reports-view.tsx': {
    overview: '[UI-DASH-002] 리포트 메인 뷰.',
    callFlow: 'getReportData → ReportDetailPanel + ReportCardList',
  },
  'src/components/reports/report-detail-panel.tsx': {
    overview: '[UI-DASH-002] 리포트 상세 분석 패널.',
    callFlow: 'props(report) → keyInsights + analysisParagraphs',
  },
  'src/components/reports/report-card-list.tsx': {
    overview: '[UI-DASH-002] 리포트 카드 목록.',
    callFlow: 'props(cards) → card grid render',
  },
  'src/components/reports/report-type-tabs.tsx': {
    overview: '[UI-DASH-002] 주간/월간 탭 전환.',
    callFlow: 'ReportTypeTabs value/onChange → ReportsView',
  },
  'src/components/reviews/reviews-view.tsx': {
    overview: '[UI-REVIEW-001] 복기 일지 목록 뷰.',
    callFlow: 'getReviewJournals → filter → ReviewJournalList',
  },
  'src/components/reviews/review-journal-list.tsx': {
    overview: '[UI-REVIEW-001] 일지 카드 리스트.',
    callFlow: 'props(entries) → ReviewJournalCard[]',
  },
  'src/components/reviews/review-journal-card.tsx': {
    overview: '[UI-REVIEW-001] 3분 스캔용 일지 스냅 카드.',
    callFlow: 'entry → Link(/review/[id])',
  },
  'src/components/reviews/review-detail-view.tsx': {
    overview: '[UI-REVIEW-002] 복기 상세 대시보드.',
    callFlow: 'getReviewDetail(id) → chart + insights + analysis',
  },
  'src/components/reviews/review-insights-panel.tsx': {
    overview: '[UI-REVIEW-002] AI 인사이트 패널.',
    callFlow: 'props(insights) → panel render',
  },
  'src/components/reviews/review-timeline-chart.tsx': {
    overview: '[UI-REVIEW-002] 복기 타임라인 차트.',
    callFlow: 'props(timeline) → Recharts',
  },
  'src/hooks/use-mobile.tsx': {
    overview: '모바일 breakpoint (768px) 감지 훅.',
    callFlow: 'matchMedia → useIsMobile boolean',
  },
  'src/hooks/use-toast.ts': {
    overview: 'Toast 알림 상태 훅 (shadcn).',
    callFlow: 'useToast() → toast({ title, description })',
  },
};

const UI_OVERVIEW = 'shadcn/ui 프리미티브 — 비즈니스 로직 없음.';

const TEST_META = {
  'alert-setting-form.test.tsx': { target: 'AlertSettingForm', task: 'UI-ALERT-001' },
  'auth-validation.test.ts': { target: 'lib/auth-validation', task: 'UI-AUTH-001' },
  'cooldown-banner.test.tsx': { target: 'CooldownBanner', task: 'UI-ALERT-002' },
  'csv-upload-zone.test.tsx': { target: 'CsvUploadZone', task: 'UI-CSV-001' },
  'csv-upload.test.ts': { target: 'lib/csv-upload + actions/csv-upload', task: 'UI-CSV-001' },
  'dashboard-analytics.test.tsx': { target: 'DashboardAnalytics', task: 'UI-DASH-001' },
  'dashboard-fixtures.test.ts': { target: 'lib/dashboard-fixtures', task: 'UI-DASH-001' },
  'discipline.test.ts': { target: 'lib/discipline', task: 'UI-ALERT-002' },
  'login-form.test.tsx': { target: 'LoginForm', task: 'UI-AUTH-001' },
  'period-filter.test.tsx': { target: 'PeriodFilter', task: 'UI-DASH-001' },
  'register-form.test.tsx': { target: 'RegisterForm', task: 'UI-AUTH-001' },
  'report-fixtures.test.ts': { target: 'lib/report-fixtures', task: 'UI-DASH-002' },
  'reports-view.test.tsx': { target: 'ReportsView', task: 'UI-DASH-002' },
  'review-detail-fixtures.test.ts': { target: 'lib/review-detail-fixtures', task: 'UI-REVIEW-002' },
  'review-detail-view.test.tsx': { target: 'ReviewDetailView', task: 'UI-REVIEW-002' },
  'review-fixtures.test.ts': { target: 'lib/review-fixtures', task: 'UI-REVIEW-001' },
  'review-journal-card.test.tsx': { target: 'ReviewJournalCard', task: 'UI-REVIEW-001' },
  'review-journal-list.test.tsx': { target: 'ReviewJournalList', task: 'UI-REVIEW-001' },
  'reviews-view.test.tsx': { target: 'ReviewsView', task: 'UI-REVIEW-001' },
};

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx|css)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

function relPath(abs) {
  return ('src/' + path.relative(SRC, abs)).replace(/\\/g, '/');
}

function hasFileTag(content) {
  return /\/\/ @file |\/\* @file /.test(content);
}

function hasOverviewTag(content) {
  return /\*\s*@overview\b/m.test(content);
}

function hasCallFlowTag(content) {
  return /\*\s*@call-flow\b/m.test(content);
}

function isMalformed(content) {
  return / \*  \* @call-flow/.test(content) || /@fileOverview/.test(content);
}

function isComplete(content, isUi) {
  if (!hasFileTag(content) || !hasOverviewTag(content)) return false;
  if (isUi) return true;
  return hasCallFlowTag(content) && !isMalformed(content);
}

function buildJsdoc(meta, isCss = false) {
  const lines = [` * @overview ${meta.overview}`];
  if (meta.callFlow && !meta.skipCallFlow) {
    lines.push(' *', ' * @call-flow');
    for (const row of meta.callFlow.split('\n')) {
      lines.push(` * ${row.trim()}`);
    }
  }
  const body = lines.join('\n');
  if (isCss) {
    return `/* @file src/app/globals.css\n${body}\n */`;
  }
  return `/**\n${body}\n */`;
}

function stripHeaderBlocks(content, isCss) {
  let c = content;
  c = c.replace(/\/\*\*[\s\S]*?\* @fileOverview[\s\S]*?\*\//g, '');
  c = c.replace(/^(\/\/ @file .+\r?\n)(?:\/\*\*[\s\S]*?\*\/\r?\n)+/m, '$1');
  if (isCss) {
    c = c.replace(/\/\* @file src\/app\/globals\.css[\s\S]*?\*\/\r?\n/g, '');
  }
  return c.replace(/\n{3,}/g, '\n\n');
}

function ensureFileLine(content, rel, isCss) {
  if (hasFileTag(content)) return content;
  if (isCss) {
    return content.replace(
      /@tailwind utilities;\n/,
      `@tailwind utilities;\n\n/* @file ${rel} */\n`
    );
  }
  const directiveMatch = content.match(/^((?:'use (?:client|server)'|"use (?:client|server)");?\s*\r?\n)/);
  const fileLine = `// @file ${rel}\n`;
  if (directiveMatch) return directiveMatch[1] + fileLine + content.slice(directiveMatch[1].length);
  return fileLine + content;
}

function insertJsdoc(content, rel, jsdoc, isCss) {
  if (isCss) {
    if (hasOverviewTag(content)) return content;
    return content.replace(
      /@tailwind utilities;\n\n/,
      `@tailwind utilities;\n\n${jsdoc}\n\n`
    );
  }
  if (hasOverviewTag(content.split(/\r?\n/).slice(0, 25).join('\n'))) {
    return content;
  }
  return content.replace(/^(\/\/ @file .+\r?\n)/m, `$1${jsdoc}\n`);
}

function getMeta(rel, basename, isUi, isTest) {
  if (META[rel]) return META[rel];
  if (isUi) return { overview: UI_OVERVIEW, skipCallFlow: true };
  if (isTest && TEST_META[basename]) {
    const t = TEST_META[basename];
    return {
      overview: `[${t.task}] ${basename} — ${t.target} 단위/통합 테스트.`,
      callFlow: `1. render/mount ${t.target}\n2. assert UI states + interactions`,
    };
  }
  if (isTest) {
    return {
      overview: `${basename} — Jest 테스트.`,
      callFlow: 'describe → it → expect',
    };
  }
  return {
    overview: `${rel} — IronTrader studio module.`,
    callFlow: 'See docs/CODE_INDEX.md',
  };
}

let updated = 0;
let skipped = 0;

for (const abs of walk(SRC)) {
  const rel = relPath(abs);
  const basename = path.basename(abs);
  const isUi = /\/components\/ui\//.test(rel);
  const isTest = /\/__tests__\//.test(rel);
  const isCss = rel.endsWith('.css');

  let content = fs.readFileSync(abs, 'utf8');

  if (isComplete(content, isUi) && !isMalformed(content)) {
    skipped++;
    continue;
  }

  content = stripHeaderBlocks(content, isCss);
  content = ensureFileLine(content, rel, isCss);

  const meta = getMeta(rel, basename, isUi, isTest);
  const jsdoc = buildJsdoc(meta, isCss);
  content = insertJsdoc(content, rel, jsdoc, isCss);

  fs.writeFileSync(abs, content, 'utf8');
  updated++;
  console.log('✓', rel);
}

console.log(`\nUpdated: ${updated} | Skipped (complete): ${skipped}`);
