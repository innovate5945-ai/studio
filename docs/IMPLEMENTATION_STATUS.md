# Implementation Status — IronTrader studio

> **AI 가이드**: MVP UI Task 구현 현황 SSOT. 상세 Task 명세는 repo `TASKS/ISSUE_*.md`, SRS는 `05_SRS_v1.md` v1.3.

**기준일**: 2026-05-28 | **환경**: Next.js 15, mock data, in-memory Server Actions

**프로토타입 UI 단계**: ✅ **완료** (문서: UX_FLOW, COMPONENT_STRUCTURE, CODE_QUALITY)

---

## UI Task 현황

| Task ID | 기능 | 상태 | 핵심 파일 | 테스트 |
|---------|------|------|-----------|--------|
| UI-AUTH-001 | 로그인/회원가입 UI | ✅ UI 완료 | `components/auth/*`, `actions/auth.ts` | login-form, register-form |
| UI-CSV-001 | CSV 업로드 UI | ✅ UI 완료 | `components/upload/csv-upload-zone.tsx` | csv-upload-zone, csv-upload |
| UI-ALERT-001 | 알람 설정 UI | ✅ UI 완료 | `components/alert-setting-form.tsx` | alert-setting-form |
| UI-ALERT-002 | 쿨타임 배너 + Fact-Bomb | ✅ UI 완료 | `cooldown-banner`, `fact-bomb-modal` | cooldown-banner |
| UI-DASH-001 | 통합 대시보드 차트 | ✅ UI 완료 | `dashboard-analytics.tsx` | dashboard-analytics |
| UI-DASH-002 | 주간/월간 리포트 | ✅ UI 완료 | `components/reports/*` | reports-view |
| UI-REVIEW-001 | 복기 일지 목록 | ✅ UI 완료 | `reviews-view`, `review-journal-*` | reviews-view, journal-* |
| UI-REVIEW-002 | 복기 상세 대시보드 | ✅ UI 완료 | `review-detail-view.tsx` | review-detail-view |

**범례**: ✅ UI 완료 = mock/fixture 기반 화면·상호작용 구현. 백엔드(Firestore/Auth) 미연동.

---

## 백엔드 / 인프라 (미구현 · blueprint 예정)

| 영역 | 상태 | 비고 |
|------|------|------|
| Firebase Auth | ⏳ mock | `actions/auth.ts` setTimeout mock |
| Firestore persistence | ⏳ mock | alert-settings, cooldown in-memory |
| Real CSV parsing | ⏳ mock | `processCsvUpload` stub |
| Broker OpenAPI / OAuth | ❌ MVP 범위外 | SRS v1.3 |
| Cron real-time sync | ❌ MVP 범위外 | SRS v1.3 |

---

## 최근 수정 이력 (문서화·안정화)

| 날짜 | 항목 | 내용 |
|------|------|------|
| 2026-05-28 | Prototype wrap-up | UX_FLOW, COMPONENT_STRUCTURE, CODE_QUALITY, README 종합 |
| 2026-05-28 | Header annotation | 60 feature files `@file/@overview/@call-flow` 수동 정교화 |
| 2026-05-25 | Server Actions | `"use server"` 규칙 준수 — 스키마/타입을 `lib/*`로 분리 |
| 2026-05-25 | Visual hierarchy | Tailwind `@layer components` 타이포·PageHeader 도입 |
| 2026-05-25 | Documentation | CODE_INDEX, ARCHITECTURE, AI_CONTEXT, 주석 가이드 추가 |

---

## 테스트

```bash
cd studio
npm test          # Jest (ts-node 필요 시 설치)
npm run typecheck
npm run lint
```

| 영역 | 테스트 파일 수 |
|------|----------------|
| UI 컴포넌트 | 12 |
| lib/fixtures | 5 |
| **합계** | 18 |

---

## 후속 작업 우선순위 (제안)

1. MOCK-001~005 / QRY-* Task와 fixture → API 연동
2. Firebase Auth + Firestore (Authenticated Vault)
3. E2E (Playwright) — 주요 user flow
4. `components/ui/*` shadcn 업데이트 시 `@file` 주석 유지

---

## 관련 문서

- [UX_FLOW.md](./UX_FLOW.md) — UX 핵심 시나리오
- [COMPONENT_STRUCTURE.md](./COMPONENT_STRUCTURE.md) — 컴포넌트 계층·개선점
- [CODE_QUALITY.md](./CODE_QUALITY.md) — 코드 품질 평가
- [ARCHITECTURE.md](./ARCHITECTURE.md) — call-flow
- [CODE_INDEX.md](./CODE_INDEX.md) — 파일 주소
- [CODE_ANNOTATION_GUIDE.md](./CODE_ANNOTATION_GUIDE.md) — 주석 규칙
- [AI_CONTEXT.md](./AI_CONTEXT.md) — AI 압축 컨텍스트
