# IronTrader

Firebase Studio 기반 **Next.js 15** 트레이딩 규율 대시보드 프로토타입입니다.  
손실 한도·거래 빈도 설정, AI 매매 심리 분석(Fact-Bomb), CSV 업로드, 성과 리포트, 3분 Snap-Scan 복기 일지를 mock/fixture 기반으로 구현했습니다.

> **프로토타입 단계 완료** (2026-05-28) — UI Task 8건 구현, feature 코드 60파일 주석·문서화 완료.

---

## 프로토타입 요약

| 항목 | 상태 |
|------|------|
| UI Tasks (UI-AUTH ~ UI-REVIEW) | ✅ mock/fixture 기반 UI 완료 |
| 규율 enforcement flow | ✅ breach → cooldown → Fact-Bomb |
| Genkit AI Fact-Bomb | ✅ Gemini 2.5 Flash (API key 필요) |
| Firebase Auth / Firestore | ⏳ blueprint 예정 |
| Production backend | ❌ 의도적 defer |

---

## 주요 기능

| 기능 | Task | 경로 |
|------|------|------|
| Command Center | UI-DASH-001, UI-ALERT-002 | `/` |
| Discipline Thresholds | UI-ALERT-001 | `/settings` |
| CSV Import | UI-CSV-001 | `/upload` |
| Performance Reports | UI-DASH-002 | `/reports` |
| Snap-Scan Review | UI-REVIEW-001/002 | `/reviews`, `/review/[id]` |
| Login / Register | UI-AUTH-001 | `/login`, `/register` |
| Cooldown Banner + Fact-Bomb | UI-ALERT-002 | 전역 layout |
| Audit / System (mock) | — | `/audit`, `/system` |

---

## 기술 스택

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: Tailwind CSS, [shadcn/ui](https://ui.shadcn.com/), Recharts
- **AI**: [Genkit](https://genkit.dev/) + Gemini 2.5 Flash
- **배포**: Firebase App Hosting (`apphosting.yaml`)

---

## 빠른 시작

```bash
git clone <repository-url>
cd studio
npm install
```

`.env.local`:

```env
GEMINI_API_KEY=your-gemini-api-key
```

```bash
npm run dev    # http://localhost:9002
```

Genkit Dev UI (선택): `npm run genkit:dev` → http://localhost:4000

---

## npm 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | Next.js dev (Turbopack, **포트 9002**) |
| `npm run build` | 프로덕션 빌드 |
| `npm run typecheck` | TypeScript 검사 |
| `npm run lint` | ESLint |
| `npm test` | Jest (ts-node 필요) |
| `npm run genkit:dev` | Genkit flow 디버깅 |

---

## 프로젝트 구조

```
studio/
├── src/
│   ├── app/              # App Router (auth + dashboard groups)
│   ├── actions/          # Server Actions (async only)
│   ├── components/       # feature + ui/shadcn
│   ├── contexts/         # DisciplineProvider
│   ├── lib/              # schemas, fixtures, pure utils
│   └── ai/               # Genkit flows
├── docs/                 # SSOT 문서 (아래 표 참조)
├── scripts/              # 주석 자동화 스크립트
└── src/__tests__/        # Jest (18 files)
```

경로 별칭: `@/*` → `src/*`

---

## 문서 (SSOT)

### 프로토타입 마무리 문서

| 문서 | 용도 |
|------|------|
| [**UX_FLOW.md**](docs/UX_FLOW.md) | **UX 핵심 시나리오** — 7개 flow, mermaid |
| [**COMPONENT_STRUCTURE.md**](docs/COMPONENT_STRUCTURE.md) | **컴포넌트 계층·개선점** |
| [**CODE_QUALITY.md**](docs/CODE_QUALITY.md) | **코드 품질 평가** — 점수·부채·exit criteria |

### 개발·AI 참조

| 문서 | 용도 |
|------|------|
| [AI_CONTEXT.md](docs/AI_CONTEXT.md) | AI 에이전트 1순위 압축 컨텍스트 |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | 레이어·call-flow·Server Action 규칙 |
| [CODE_INDEX.md](docs/CODE_INDEX.md) | 파일 경로 카탈로그 |
| [IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md) | UI Task 구현 현황 |
| [CODE_ANNOTATION_GUIDE.md](docs/CODE_ANNOTATION_GUIDE.md) | `@file` / `@overview` / `@call-flow` |
| [blueprint.md](docs/blueprint.md) | 제품·디자인 SSOT |

---

## UX 핵심 시나리오 (요약)

1. **S1 Auth** — register → login → Command Center  
2. **S2 Live Session** — Start Session → record trade/loss → breach → **CooldownBanner** + **FactBombAlertModal**  
3. **S3 Settings** — 손실%/매매횟수 임계값 저장  
4. **S4 CSV** — DnD upload → validation → mock ingest  
5. **S5 Reports** — weekly/monthly analytics  
6. **S6 Review** — 3분 snap list → search → detail (timeline + AI insights)

상세: [docs/UX_FLOW.md](docs/UX_FLOW.md)

---

## 컴포넌트 계층 (요약)

```
app/layout → DisciplineProvider
  └─ (dashboard)/layout → AppSidebar + CooldownBanner + FactBombAlertModal
       └─ pages → PageHeader + feature components
            ├─ DashboardAnalytics → charts (UI-DASH-001)
            ├─ ReportsView → panels/cards (UI-DASH-002)
            ├─ ReviewsView → ReviewDetailView (UI-REVIEW)
            └─ AlertSettingForm / CsvUploadZone / auth forms
```

상세 mermaid·개선점: [docs/COMPONENT_STRUCTURE.md](docs/COMPONENT_STRUCTURE.md)

---

## 코드 품질 (프로토타입)

| 영역 | 등급 | 비고 |
|------|------|------|
| 아키텍처 | A | lib/actions/contexts 분리 |
| UX 완성도 | A | 8 UI Tasks |
| 문서·주석 | A | 60 feature files annotated |
| 타입 안전성 | B+ | calendar.tsx shadcn 이슈 잔존 |
| 테스트 실행 | B | ts-node 미설치 |
| 운영 준비 | C | mock backend |

상세: [docs/CODE_QUALITY.md](docs/CODE_QUALITY.md)

---

## 코드 주석 규칙

feature 파일 (`lib`, `actions`, `components` feature, `app`, `ai`):

```typescript
'use server';

// @file src/actions/alert-settings.ts
/**
 * @overview [UI-ALERT-001] 알람 설정 Server Actions
 *
 * @call-flow
 * 1. settings/page → getAlertSettings()
 * 2. AlertSettingForm → saveAlertSettings
 */
```

**제외**: `components/ui/*` (shadcn), `__tests__/*`

### 주석 자동화 스크립트

| 스크립트 | 용도 |
|----------|------|
| `node scripts/add-file-headers.mjs` | `@file` 태그만 추가 |
| `node scripts/enrich-file-headers.mjs` | `@overview` + `@call-flow` bulk |
| `node scripts/remove-fileoverview.mjs` | 레거시 `@fileOverview` 제거 |

각 스크립트 상단 docstring — **개발자·AI 에이전트** dual-purpose.

---

## AI Fact-Bomb

1. `GEMINI_API_KEY` 설정  
2. `/` → **Generate Fact-Bomb** (수동) 또는 규율 breach 시 자동 modal  
3. Flow: `src/ai/flows/ai-reality-check-fact-bomb.ts`

---

## 트러블슈팅

| 증상 | 해결 |
|------|------|
| AI API 오류 | `.env.local` + dev 서버 재시작 |
| 포트 9002 충돌 | `npm run dev -- -p 3000` |
| `npm test` 실패 | `npm i -D ts-node` |
| Windows build | `$env:NODE_ENV="production"; npm run build` |

---

## 디자인

- Primary `#8a70ff` · Background `#14131a` · Accent `#8ab2ff`
- Headline: Space Grotesk · Body: Inter

---

## 라이선스

Private project (`"private": true`)
