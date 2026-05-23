# IronTrader

Firebase Studio 기반 **Next.js 15** 트레이딩 규율 대시보드입니다. 손실 한도·거래 빈도 설정, AI 기반 매매 심리 분석(Fact-Bomb), CSV 업로드, 성과 리포트 등을 한 화면에서 확인할 수 있습니다.

> 상세 기능 명세는 [`docs/blueprint.md`](docs/blueprint.md)를 참고하세요.

---

## 주요 기능

| 기능 | 설명 | 경로 |
|------|------|------|
| **Command Center** | 실시간 에쿼티·MDD 대시보드, 세션 시작/종료 | `/` |
| **Trade Logs** | 시간순 거래 카드 스냅 리뷰 | `/review`, `/review/[id]` |
| **Analytics** | 승률·MDD 등 기간별 성과 분석 | `/reports` |
| **CSV Upload** | 드래그 앤 드롭 거래 내역 업로드 | `/upload` |
| **Discipline Thresholds** | 손실 한도·매매 횟수 상한 설정 | `/settings` |
| **Audit Trail** | 규율 위반·설정 변경 이력 | `/audit` |
| **System Settings** | 시스템 환경 설정 | `/system` |
| **AI Reality-Check (Fact-Bomb)** | Gemini 기반 매매 로그 심리 분석 | 대시보드 모달 |
| **Cooldown Banner** | 규율 위반 시 강제 휴식 배너 | 전역 레이아웃 |

---

## 기술 스택

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: Tailwind CSS, [shadcn/ui](https://ui.shadcn.com/) (Radix UI), Recharts
- **AI**: [Google Genkit](https://genkit.dev/) + `@genkit-ai/google-genai` (Gemini 2.5 Flash)
- **배포**: Firebase App Hosting (`apphosting.yaml`)
- **워크스페이스**: Firebase Studio / IDX (`.idx/dev.nix`)

---

## 사전 요구 사항

- **Node.js** 20 이상 (Firebase Studio IDX 환경은 Node 22 사용)
- **npm** (또는 호환 패키지 매니저)
- **Google Gemini API Key** — AI Fact-Bomb 기능 사용 시 필수  
  [Google AI Studio](https://aistudio.google.com/apikey)에서 발급

---

## 빠른 시작

### 1. 저장소 클론 및 의존성 설치

```bash
git clone <repository-url>
cd studio
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다. (`.gitignore`에 의해 Git에 포함되지 않습니다.)

```env
# Google Genkit / Gemini (AI Reality-Check 필수)
GEMINI_API_KEY=your-gemini-api-key

# GOOGLE_API_KEY 도 동일하게 사용 가능 (GEMINI_API_KEY 우선)
```

> **참고**: `firebase` 패키지는 설치되어 있으나, 현재 UI는 대부분 목(mock) 데이터로 동작합니다. Firebase Auth / Firestore 연동은 blueprint에 정의된 향후 기능입니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:9002](http://localhost:9002) 로 접속합니다.

### 4. (선택) Genkit 개발 UI 실행

AI Flow를 Genkit Developer UI에서 직접 테스트하려면 **별도 터미널**에서 실행합니다.

```bash
npm run genkit:dev
```

소스 변경 시 자동 재시작:

```bash
npm run genkit:watch
```

Genkit UI는 일반적으로 [http://localhost:4000](http://localhost:4000) 에서 열립니다.  
앱 내 Fact-Bomb은 Next.js Server Action(`src/ai/flows/ai-reality-check-fact-bomb.ts`)으로 동작하므로, **UI만 보려면 `npm run dev`만으로도 충분**합니다. AI 분석을 실제로 호출하려면 `GEMINI_API_KEY`가 필요합니다.

---

## npm 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | Next.js 개발 서버 (Turbopack, **포트 9002**) |
| `npm run genkit:dev` | Genkit 로컬 개발 서버 + Flow 디버깅 |
| `npm run genkit:watch` | Genkit watch 모드 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과물 실행 (기본 포트 3000) |
| `npm run lint` | ESLint 검사 |
| `npm run typecheck` | TypeScript 타입 검사 (`tsc --noEmit`) |
| `npm test` | Jest 컴포넌트 테스트 실행 |
| `npm run test:watch` | Jest watch 모드 |

### Windows에서 빌드 시 참고

`package.json`의 `build` 스크립트는 Unix 형식(`NODE_ENV=production`)입니다. Windows PowerShell/CMD에서는 아래처럼 실행하세요.

```powershell
$env:NODE_ENV="production"; npm run build
```

또는 Git Bash / WSL 환경에서 `npm run build`를 그대로 사용할 수 있습니다.

---

## 프로젝트 구조

```
studio/
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── page.tsx            # 대시보드 (Command Center)
│   │   ├── review/             # Trade Logs
│   │   ├── reports/            # Analytics
│   │   ├── upload/             # CSV Upload
│   │   ├── settings/           # Discipline Thresholds
│   │   ├── audit/              # Audit Trail
│   │   └── system/             # System Settings
│   ├── actions/
│   │   └── alert-settings.ts   # [UI-ALERT-001] 알람 설정 Server Action
│   ├── ai/
│   │   ├── genkit.ts           # Genkit + Gemini 설정
│   │   ├── dev.ts              # Genkit dev 진입점
│   │   └── flows/
│   │       └── ai-reality-check-fact-bomb.ts  # Fact-Bomb Server Action
│   ├── components/
│   │   ├── layout/             # 사이드바 등 레이아웃
│   │   ├── ai/                 # Fact-Bomb 모달
│   │   ├── dashboard/          # Cooldown 배너 등
│   │   └── ui/                 # shadcn/ui 컴포넌트
│   ├── hooks/
│   └── lib/
├── docs/
│   └── blueprint.md            # PRD / 기능 명세
├── apphosting.yaml             # Firebase App Hosting 설정
├── .idx/dev.nix                # Firebase Studio 워크스pace 설정
└── package.json
```

경로 별칭: `@/*` → `src/*` (`tsconfig.json`)

---

## Firebase Studio / IDX에서 실행

Firebase Studio 워크스페이스에서는 `.idx/dev.nix` 설정에 따라 Node 22가 제공됩니다. Preview는 다음 명령으로 자동 실행됩니다.

```bash
npm run dev -- --port $PORT --hostname 0.0.0.0
```

로컬과 동일하게 `npm install` 후 `npm run dev`로 시작하면 됩니다.

---

## Firebase App Hosting 배포

1. Firebase 프로젝트를 연결합니다.
2. App Hosting 백엔드를 생성하고 이 저장소를 연결합니다.
3. 배포 시 **Secret**으로 `GEMINI_API_KEY`를 등록합니다.

```bash
firebase apphosting:secrets:set GEMINI_API_KEY
```

`apphosting.yaml`에서 인스턴스 수 등 런타임 설정을 조정할 수 있습니다.

---

## AI Fact-Bomb 사용 방법

1. `GEMINI_API_KEY`를 `.env.local`에 설정합니다.
2. `npm run dev`로 앱을 실행합니다.
3. 대시보드(`/`)에서 **Generate Fact-Bomb** 버튼을 클릭합니다.
4. **Deploy Fact-Bomb**을 누르면 Gemini가 샘플 거래 로그를 분석해 리포트를 생성합니다.

Flow 정의: `src/ai/flows/ai-reality-check-fact-bomb.ts`  
모델: `googleai/gemini-2.5-flash` (`src/ai/genkit.ts`)

---

## 트러블슈팅

| 증상 | 해결 방법 |
|------|-----------|
| AI 분석 실패 / API key 오류 | `.env.local`에 `GEMINI_API_KEY` 설정 후 dev 서버 재시작 |
| 포트 충돌 (9002) | `npm run dev -- -p 3000` 등으로 포트 변경 |
| Genkit UI가 열리지 않음 | `npm run genkit:dev` 실행 여부 확인, 4000번 포트 사용 중인지 확인 |
| Windows에서 `npm run build` 실패 | 위 **Windows 빌드** 절 참고 |
| `.genkit/` 폴더 | Genkit 실행 시 생성되며 `.gitignore` 대상 |

---

## 디자인 가이드

- **Primary**: Electric Indigo `#8a70ff`
- **Background**: Obsidian Night `#14131a`
- **Accent**: Azure Frost `#8ab2ff`
- **Headline**: Space Grotesk / **Body**: Inter

---

## 라이선스

Private project (`package.json`: `"private": true`)
