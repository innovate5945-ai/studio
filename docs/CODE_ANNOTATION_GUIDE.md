# 코드 주석 & 문서화 가이드

> **AI 가이드**: 이 문서는 IronTrader `studio/` 프로젝트의 **주석 작성 규칙 SSOT**입니다. 새 파일 추가·리팩터링 시 반드시 이 형식을 따르세요. 압축 컨텍스트는 [`AI_CONTEXT.md`](./AI_CONTEXT.md)를 우선 참조하세요.

---

## 1. 파일명 주석 (`@file`)

**위치**: 파일 최상단. `'use client'` / `'use server'` 지시어가 있으면 **그 다음 줄**.

```typescript
'use server';

// @file src/actions/alert-settings.ts
```

```tsx
"use client"

// @file src/components/dashboard/cooldown-banner.tsx
```

CSS는 doctype 없이 첫 줄:

```css
/* @file src/app/globals.css */
```

---

## 2. 파일 개요 블록

`@file` 바로 아래에 JSDoc 블록으로 작성합니다.

| 태그 | 필수 | 설명 |
|------|------|------|
| `@overview` | ✅ | 파일 역할, SRS Task ID(해당 시), 1~3문장 |
| `@call-flow` | 로직 파일 | 주요 호출 순서 (번호 목록) |
| `@constraints` | 해당 시 | `"use server"` 규칙, RLS, MVP 범위 등 |
| `@see` | 선택 | 연관 파일 경로 |

**예시 (Server Action):**

```typescript
/**
 * @overview [UI-ALERT-001] 알람 설정 Server Actions — 손실폭·매매횟수 임계값 조회/저장.
 *
 * @call-flow
 * 1. SettingsPage → getAlertSettings()
 * 2. AlertSettingForm → saveAlertSettings(input) → AlertSettingsSchema.safeParse → cache 갱신
 *
 * @constraints "use server" — async function만 export. 타입/스키마는 lib/alert-settings.ts.
 * @see src/lib/alert-settings.ts
 */
```

---

## 3. 프로그램 요소 개요 (함수·클래스·컴포넌트)

export되는 요소 상단에 JSDoc 한 줄 이상:

```typescript
/** 서버 메모리 캐시에서 현재 알람 설정을 조회합니다. */
export async function getAlertSettings(): Promise<AlertSettingsInput> { ... }
```

```tsx
/** [UI-ALERT-002] 규율 위반 시 상단 sticky 쿨타임 배너. useDiscipline()의 cooldown/timeLeft 소비. */
export function CooldownBanner() { ... }
```

---

## 4. 함수 호출 구조 주석 (`@call-flow`)

연속 호출이 있는 파일 **파일 개요**에 번호 목록으로 작성합니다.

**DisciplineProvider 예시:**

```
@call-flow
1. bootstrap (useEffect): getAlertSettings ∥ getDisciplineCooldown → readStoredCooldown merge
2. session tick: evaluateDisciplineBreach(metrics, settings) → triggerBreach
3. triggerBreach: startDisciplineCooldown → applyCooldown → setIsFactBombOpen(true)
4. cooldown tick: getRemainingSeconds → 만료 시 clearStoredCooldown
```

---

## 5. shadcn/ui 예외

`src/components/ui/*` 는 shadcn 생성 프리미티브입니다. **파일명 주석만** 추가하고 `@overview`는 생략 가능합니다.

---

## 6. 문서 체계

| 문서 | 용도 | 독자 |
|------|------|------|
| [README.md](../README.md) | 프로젝트 소개·실행·구조 | 사람 |
| [blueprint.md](./blueprint.md) | 제품 기능·디자인 SSOT | 사람 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 레이어·호출 그래프·데이터 흐름 | 사람 + AI |
| [CODE_INDEX.md](./CODE_INDEX.md) | 파일 경로 카탈로그 (코드 주소) | AI |
| [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) | Task별 구현 현황 | 사람 + AI |
| [AI_CONTEXT.md](./AI_CONTEXT.md) | 압축 컨텍스트 (토큰 절약) | **AI 우선** |

---

## 7. 후속 프롬프트용 카피 템플릿

```
IronTrader studio/ 작업 요청:
- 대상 파일: src/contexts/discipline-provider.tsx
- Task: UI-ALERT-002
- 호출 흐름: evaluateDisciplineBreach → startDisciplineCooldown → CooldownBanner
- 제약: "use server" 파일은 async function만 export
- SSOT: docs/AI_CONTEXT.md, 05_SRS_v1.md v1.3
```
