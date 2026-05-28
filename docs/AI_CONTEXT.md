# AI_CONTEXT — IronTrader studio (압축)

> **AI 가이드**: 사람용 상세 문서 대신 **이 파일을 먼저** 읽으세요. 경로·호출·제약만 담았습니다. 상세는 `ARCHITECTURE.md`, Task SSOT는 repo `TASKS/` + `05_SRS_v1.md` v1.3.

---

## 프로젝트

- **이름**: IronTrader | **경로**: `studio/` | **포트**: 9002
- **스택**: Next.js 15 App Router, React 19, Tailwind, shadcn/ui, Genkit/Gemini
- **MVP**: mock data + in-memory server actions (Firestore/Auth 미연동)

---

## 레이어 (짧은 주소)

```
app/          라우트·레이아웃
components/   UI (feature + ui/shadcn)
contexts/     discipline-provider.tsx ← 전역 규율 상태
actions/      Server Actions ONLY async exports
lib/          schema, fixtures, pure utils
ai/           Genkit flows
```

---

## 필수 Call-Flow (3개)

**부트**: `DisciplineProvider` → `getAlertSettings` + `getDisciplineCooldown` + `readStoredCooldown`

**위반**: `recordTrade/addLoss` → `evaluateDisciplineBreach`(lib/discipline) → `startDisciplineCooldown` → `CooldownBanner` + `FactBombAlertModal`

**설정**: `AlertSettingForm` → `saveAlertSettings` → `AlertSettingsSchema`(lib/alert-settings)

---

## Server Action 제약

`"use server"` → **async function만 export**. Zod/타입/상수는 `lib/*`로 분리.

| file | exports |
|------|---------|
| actions/alert-settings.ts | getAlertSettings, saveAlertSettings |
| actions/discipline-cooldown.ts | getDisciplineCooldown, startDisciplineCooldown, clearDisciplineCooldown |
| actions/auth.ts | loginUser, registerUser |
| actions/csv-upload.ts | processCsvUpload |

---

## 라우트 → 파일

| route | page file |
|-------|-----------|
| / | app/(dashboard)/page.tsx |
| /settings | app/(dashboard)/settings/page.tsx |
| /upload | app/(dashboard)/upload/page.tsx |
| /reviews | app/(dashboard)/reviews/page.tsx |
| /review/[id] | app/(dashboard)/review/[id]/page.tsx |
| /reports | app/(dashboard)/reports/page.tsx |
| /login | app/(auth)/login/page.tsx |

---

## SRS UI Task → 핵심 파일

- UI-AUTH-001: components/auth/*, actions/auth.ts
- UI-CSV-001: components/upload/csv-upload-zone.tsx, actions/csv-upload.ts
- UI-ALERT-001: components/alert-setting-form.tsx, actions/alert-settings.ts
- UI-ALERT-002: cooldown-banner.tsx, fact-bomb-modal.tsx, discipline-provider.tsx
- UI-DASH-001: dashboard-analytics.tsx, lib/dashboard-fixtures.ts
- UI-DASH-002: components/reports/*, lib/report-fixtures.ts
- UI-REVIEW-001: reviews-view.tsx, review-journal-*
- UI-REVIEW-002: review-detail-view.tsx, lib/review-detail-fixtures.ts

---

## 실행

```bash
cd studio && npm install && npm run dev   # :9002
# AI: GEMINI_API_KEY in .env.local
```

## 주석 규칙

`// @file src/...` + `@overview` + `@call-flow` → `docs/CODE_ANNOTATION_GUIDE.md`

## 전체 파일 목록

→ `docs/CODE_INDEX.md`
