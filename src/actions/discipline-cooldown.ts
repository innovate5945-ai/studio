'use server';

// @file src/actions/discipline-cooldown.ts
/**
 * @overview [UI-ALERT-002] 규율 쿨타임 Server Actions — 위반 시 30분 강제 휴식 상태 관리 (in-memory mock).
 *
 * @call-flow
 * 1. DisciplineProvider.bootstrap → getDisciplineCooldown()
 * 2. evaluateDisciplineBreach → startDisciplineCooldown({ breachType, reason })
 * 3. CooldownBanner ← useDiscipline().cooldown / timeLeft
 *
 * @constraints "use server" — async function만 export. 타입/스키마는 lib/discipline-cooldown.ts.
 * @see src/contexts/discipline-provider.tsx
 */
import {
  COOLDOWN_DURATION_SECONDS,
  EMPTY_COOLDOWN,
  StartCooldownSchema,
  type DisciplineCooldownState,
  type StartCooldownInput,
} from '@/lib/discipline-cooldown';

// TODO: Replace with Firestore when Authenticated Vault is wired up.
let cachedCooldown: DisciplineCooldownState = { ...EMPTY_COOLDOWN };

/** 만료된 쿨타임을 정리하고 현재 상태를 반환합니다. */
function hydrateCooldown(): DisciplineCooldownState {
  if (!cachedCooldown.active || cachedCooldown.endsAt === null) {
    return { ...cachedCooldown };
  }

  if (Date.now() >= cachedCooldown.endsAt) {
    cachedCooldown = { ...EMPTY_COOLDOWN };
  }

  return { ...cachedCooldown };
}

/** 현재 쿨타임 상태를 조회합니다. */
export async function getDisciplineCooldown(): Promise<DisciplineCooldownState> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return hydrateCooldown();
}

/** 규율 위반 시 쿨타임을 시작합니다. 이미 active면 기존 상태를 반환합니다. */
export async function startDisciplineCooldown(
  input: StartCooldownInput
): Promise<DisciplineCooldownState> {
  const parsed = StartCooldownSchema.safeParse(input);

  if (!parsed.success) {
    return hydrateCooldown();
  }

  const current = hydrateCooldown();
  if (current.active) {
    return current;
  }

  cachedCooldown = {
    active: true,
    endsAt: Date.now() + COOLDOWN_DURATION_SECONDS * 1000,
    breachType: parsed.data.breachType,
    reason: parsed.data.reason,
  };

  return { ...cachedCooldown };
}

/** 쿨타임을 수동 해제합니다 (mock/테스트용). */
export async function clearDisciplineCooldown(): Promise<DisciplineCooldownState> {
  cachedCooldown = { ...EMPTY_COOLDOWN };
  return { ...cachedCooldown };
}
