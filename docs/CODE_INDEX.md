# CODE_INDEX — 파일 경로 카탈로그 (코드 주소)

> **AI 가이드**: IronTrader `studio/src/` 전체 파일 주소·한 줄 설명. 후속 작업 시 `@file` 경로 확인용. 압축 컨텍스트는 [`AI_CONTEXT.md`](./AI_CONTEXT.md).

---

## actions/ — Server Actions

| 경로 | Task | 설명 |
|------|------|------|
| `src/actions/alert-settings.ts` | UI-ALERT-001 | getAlertSettings, saveAlertSettings |
| `src/actions/discipline-cooldown.ts` | UI-ALERT-002 | 쿨타임 조회/시작/해제 |
| `src/actions/auth.ts` | UI-AUTH-001 | loginUser, registerUser (mock) |
| `src/actions/csv-upload.ts` | UI-CSV-001 | processCsvUpload |

## lib/ — 스키마·검증·Fixtures·순수 함수

| 경로 | Task | 설명 |
|------|------|------|
| `src/lib/alert-settings.ts` | UI-ALERT-001 | AlertSettingsSchema, 타입, 기본값 |
| `src/lib/discipline-cooldown.ts` | UI-ALERT-002 | BreachType, CooldownState, StartCooldownSchema |
| `src/lib/discipline.ts` | UI-ALERT-002 | breach 평가, cooldown localStorage, 포맷 |
| `src/lib/auth-validation.ts` | UI-AUTH-001 | login/register Zod 스키마 |
| `src/lib/csv-upload.ts` | UI-CSV-001 | CSV 검증, 업로드 progress 시뮬레이션 |
| `src/lib/dashboard-fixtures.ts` | UI-DASH-001 | 대시보드 차트 mock 데이터 |
| `src/lib/report-fixtures.ts` | UI-DASH-002 | 주간/월간 리포트 mock |
| `src/lib/review-fixtures.ts` | UI-REVIEW-001 | 복기 일지 목록 mock |
| `src/lib/review-detail-fixtures.ts` | UI-REVIEW-002 | 복기 상세 mock |
| `src/lib/utils.ts` | — | cn() Tailwind merge |
| `src/lib/placeholder-images.ts` | — | placeholder 이미지 헬퍼 |

## contexts/

| 경로 | 설명 |
|------|------|
| `src/contexts/discipline-provider.tsx` | 전역 규율 상태 (settings, session, cooldown, Fact-Bomb) |

## ai/

| 경로 | 설명 |
|------|------|
| `src/ai/genkit.ts` | Genkit + Gemini 모델 설정 |
| `src/ai/dev.ts` | Genkit dev CLI 진입점 |
| `src/ai/flows/ai-reality-check-fact-bomb.ts` | Fact-Bomb Genkit Flow |

## app/ — App Router

| 경로 | Route | 설명 |
|------|-------|------|
| `src/app/layout.tsx` | — | Root: DisciplineProvider, Toaster |
| `src/app/(dashboard)/layout.tsx` | — | Sidebar, CooldownBanner, FactBombModal |
| `src/app/(dashboard)/page.tsx` | `/` | Command Center |
| `src/app/(dashboard)/settings/page.tsx` | `/settings` | Discipline Thresholds |
| `src/app/(dashboard)/upload/page.tsx` | `/upload` | CSV Upload |
| `src/app/(dashboard)/reviews/page.tsx` | `/reviews` | Trade Logs 목록 |
| `src/app/(dashboard)/review/page.tsx` | `/review` | 리다이렉트 |
| `src/app/(dashboard)/review/[id]/page.tsx` | `/review/[id]` | 복기 상세 |
| `src/app/(dashboard)/reports/page.tsx` | `/reports` | Analytics Reports |
| `src/app/(dashboard)/audit/page.tsx` | `/audit` | Audit Trail (mock) |
| `src/app/(dashboard)/system/page.tsx` | `/system` | System Settings (mock) |
| `src/app/(auth)/layout.tsx` | — | Auth shell |
| `src/app/(auth)/login/page.tsx` | `/login` | 로그인 |
| `src/app/(auth)/register/page.tsx` | `/register` | 회원가입 |
| `src/app/globals.css` | — | Tailwind + 디자인 토큰 |

## components/ — Feature UI

| 경로 | Task | 설명 |
|------|------|------|
| `src/components/layout/app-sidebar.tsx` | — | 대시보드 네비게이션 |
| `src/components/layout/page-header.tsx` | — | 페이지 제목 공통 컴포넌트 |
| `src/components/alert-setting-form.tsx` | UI-ALERT-001 | 알람 설정 폼 |
| `src/components/dashboard/cooldown-banner.tsx` | UI-ALERT-002 | 쿨타임 sticky 배너 |
| `src/components/dashboard/dashboard-analytics.tsx` | UI-DASH-001 | 승률·MDD·매매 차트 |
| `src/components/dashboard/period-filter.tsx` | UI-DASH-001 | 기간 필터 |
| `src/components/dashboard/win-rate-donut-chart.tsx` | UI-DASH-001 | 승률 도넛 |
| `src/components/dashboard/mdd-line-chart.tsx` | UI-DASH-001 | MDD 라인 |
| `src/components/dashboard/trade-count-bar-chart.tsx` | UI-DASH-001 | 매매 횟수 바 |
| `src/components/ai/fact-bomb-modal.tsx` | UI-ALERT-002 | AI Fact-Bomb 모달 |
| `src/components/auth/auth-form-layout.tsx` | UI-AUTH-001 | 인증 공통 레이아웃 |
| `src/components/auth/login-form.tsx` | UI-AUTH-001 | 로그인 폼 |
| `src/components/auth/register-form.tsx` | UI-AUTH-001 | 회원가입 폼 |
| `src/components/upload/csv-upload-zone.tsx` | UI-CSV-001 | CSV DnD 업로드 |
| `src/components/reports/reports-view.tsx` | UI-DASH-002 | 리포트 메인 뷰 |
| `src/components/reports/report-detail-panel.tsx` | UI-DASH-002 | 리포트 상세 패널 |
| `src/components/reports/report-card-list.tsx` | UI-DASH-002 | 리포트 카드 목록 |
| `src/components/reports/report-type-tabs.tsx` | UI-DASH-002 | 주간/월간 탭 |
| `src/components/reviews/reviews-view.tsx` | UI-REVIEW-001 | 복기 목록 뷰 |
| `src/components/reviews/review-journal-list.tsx` | UI-REVIEW-001 | 일지 카드 리스트 |
| `src/components/reviews/review-journal-card.tsx` | UI-REVIEW-001 | 일지 스냅 카드 |
| `src/components/reviews/review-detail-view.tsx` | UI-REVIEW-002 | 복기 상세 대시보드 |
| `src/components/reviews/review-insights-panel.tsx` | UI-REVIEW-002 | 인사이트 패널 |
| `src/components/reviews/review-timeline-chart.tsx` | UI-REVIEW-002 | 타임라인 차트 |

## components/ui/ — shadcn/ui (35 files)

`accordion`, `alert`, `alert-dialog`, `avatar`, `badge`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `menubar`, `popover`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toaster`, `tooltip`

→ 경로 패턴: `src/components/ui/{name}.tsx` — shadcn 프리미티브, 파일명 주석만 권장.

## hooks/

| 경로 | 설명 |
|------|------|
| `src/hooks/use-mobile.tsx` | 모바일 breakpoint 감지 |
| `src/hooks/use-toast.ts` | toast 훅 |

## __tests__/ (18 files)

경로 패턴: `src/__tests__/{target}.test.{ts,tsx}` — 대응 컴포넌트/lib 단위 테스트.

---

**총계**: TypeScript/TSX **114** files (+ `globals.css`)
