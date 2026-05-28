# IronTrader Architecture

> **AI 가이드**: 레이어 구조·주요 call-flow·Server Action 규칙을 담은 아키텍처 SSOT. 파일 경로 목록은 [`CODE_INDEX.md`](./CODE_INDEX.md), 압축판은 [`AI_CONTEXT.md`](./AI_CONTEXT.md).

---

## 1. 레이어 개요

```
┌─────────────────────────────────────────────────────────────┐
│  app/ (App Router)          — 라우트·레이아웃·페이지 조립      │
├─────────────────────────────────────────────────────────────┤
│  components/                — UI (feature + shadcn/ui)       │
├─────────────────────────────────────────────────────────────┤
│  contexts/                  — 클라이언트 전역 상태            │
├─────────────────────────────────────────────────────────────┤
│  actions/                   — Server Actions ("use server")   │
├─────────────────────────────────────────────────────────────┤
│  lib/                       — 스키마·검증·fixtures·순수 함수   │
├─────────────────────────────────────────────────────────────┤
│  ai/                        — Genkit Flow + Gemini            │
└─────────────────────────────────────────────────────────────┘
```

**경로 별칭**: `@/*` → `src/*`

---

## 2. App Router 구조

| Route | File | 주요 컴포넌트 |
|-------|------|---------------|
| `/` | `(dashboard)/page.tsx` | Command Center, DashboardAnalytics |
| `/reviews` | `(dashboard)/reviews/page.tsx` | ReviewsView |
| `/review/[id]` | `(dashboard)/review/[id]/page.tsx` | ReviewDetailView |
| `/reports` | `(dashboard)/reports/page.tsx` | ReportsView |
| `/upload` | `(dashboard)/upload/page.tsx` | CsvUploadZone |
| `/settings` | `(dashboard)/settings/page.tsx` | AlertSettingForm |
| `/audit` | `(dashboard)/audit/page.tsx` | 인라인 mock 테이블 |
| `/system` | `(dashboard)/system/page.tsx` | mock 시스템 설정 |
| `/login` | `(auth)/login/page.tsx` | LoginForm |
| `/register` | `(auth)/register/page.tsx` | RegisterForm |

**레이아웃 체인:**

```
app/layout.tsx
  └─ DisciplineProvider
       └─ (dashboard)/layout.tsx
            ├─ AppSidebar
            ├─ CooldownBanner
            ├─ FactBombAlertModal
            └─ {children}
```

---

## 3. 핵심 Call-Flow

### 3.1 앱 부트스트랩

```
app/layout.tsx
  → DisciplineProvider.bootstrap()
       → getAlertSettings()          [actions/alert-settings]
       → getDisciplineCooldown()     [actions/discipline-cooldown]
       → readStoredCooldown()        [lib/discipline → localStorage]
       → applyCooldown(merged)
```

### 3.2 규율 위반 → 쿨타임 → Fact-Bomb

```
(dashboard)/page.tsx
  → recordTrade() / addLoss()         [DisciplineProvider]
  → evaluateDisciplineBreach()        [lib/discipline]
  → startDisciplineCooldown()         [actions/discipline-cooldown]
  → applyCooldown() → writeStoredCooldown()
  → setIsFactBombOpen(true)
  → CooldownBanner (sticky) + FactBombAlertModal
```

### 3.3 알람 설정 저장

```
settings/page.tsx
  → getAlertSettings()                [mount]
AlertSettingForm
  → saveAlertSettings(input)          [actions/alert-settings]
  → AlertSettingsSchema.safeParse     [lib/alert-settings]
```

### 3.4 CSV 업로드

```
upload/page.tsx → CsvUploadZone
  → getCsvValidationError()           [lib/csv-upload — client]
  → simulateUploadProgress()          [lib/csv-upload — client]
  → processCsvUpload()                [actions/csv-upload]
```

### 3.5 AI Fact-Bomb

```
FactBombModal / FactBombAlertModal
  → ai-reality-check-fact-bomb flow   [ai/flows/]
  → Genkit + gemini-2.5-flash         [ai/genkit.ts]
  (requires GEMINI_API_KEY)
```

### 3.6 대시보드·리포트·복기 (Mock)

```
DashboardAnalytics → getDashboardData()     [lib/dashboard-fixtures]
ReportsView        → getReportData()        [lib/report-fixtures]
ReviewsView        → getReviewJournals()    [lib/review-fixtures]
ReviewDetailView   → getReviewDetail()     [lib/review-detail-fixtures]
```

---

## 4. Server Action 규칙

`"use server"` 파일은 **async function만 export** 가능.

| Action 파일 | Export | 스키마/타입 위치 |
|-------------|--------|------------------|
| `actions/alert-settings.ts` | getAlertSettings, saveAlertSettings | `lib/alert-settings.ts` |
| `actions/discipline-cooldown.ts` | getDisciplineCooldown, startDisciplineCooldown, clearDisciplineCooldown | `lib/discipline-cooldown.ts` |
| `actions/auth.ts` | loginUser, registerUser | `lib/auth-validation.ts` |
| `actions/csv-upload.ts` | processCsvUpload | `lib/csv-upload.ts` |

---

## 5. 상태 관리

| 상태 | 소유 | 영속성 |
|------|------|--------|
| alert settings | actions/alert-settings (server cache) | in-memory mock |
| cooldown | actions/discipline-cooldown + localStorage | hybrid |
| session metrics | DisciplineProvider (client) | session only |
| charts/reports/reviews | lib/*-fixtures | static mock |

---

## 6. SRS Task 매핑 (UI)

| Task ID | 주요 파일 |
|---------|-----------|
| UI-AUTH-001 | components/auth/*, actions/auth.ts, lib/auth-validation.ts |
| UI-CSV-001 | components/upload/csv-upload-zone.tsx, actions/csv-upload.ts |
| UI-ALERT-001 | components/alert-setting-form.tsx, actions/alert-settings.ts |
| UI-ALERT-002 | components/dashboard/cooldown-banner.tsx, components/ai/fact-bomb-modal.tsx |
| UI-DASH-001 | components/dashboard/dashboard-analytics.tsx, lib/dashboard-fixtures.ts |
| UI-DASH-002 | components/reports/*, lib/report-fixtures.ts |
| UI-REVIEW-001 | components/reviews/reviews-view.tsx, review-journal-* |
| UI-REVIEW-002 | components/reviews/review-detail-view.tsx, lib/review-detail-fixtures.ts |

---

## 7. 테스트

- 위치: `src/__tests__/`
- 실행: `npm test`
- UI Task별 컴포넌트·fixture 단위 테스트 포함
