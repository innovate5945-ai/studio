// @file src/lib/discipline-cooldown.ts
/**
 * @overview [UI-ALERT-002] 쿨타임 상태 타입·Zod 스키마·상수. Server Action과 UI 공유.
 *
 * @call-flow
 * 1. evaluateDisciplineBreach (lib/discipline) → breach 감지
 * 2. startDisciplineCooldown → StartCooldownSchema.safeParse
 * 3. endsAt = Date.now() + COOLDOWN_DURATION_SECONDS
 * 4. CooldownBanner ← useDiscipline().cooldown
 *
 * @see src/actions/discipline-cooldown.ts, src/contexts/discipline-provider.tsx
 */
import { z } from 'zod';

/** 쿨타임 지속 시간 (초) — 30분 */
export const COOLDOWN_DURATION_SECONDS = 30 * 60;

export const BreachTypeSchema = z.enum(['loss_limit', 'trade_cap']);
export type BreachType = z.infer<typeof BreachTypeSchema>;

export type DisciplineCooldownState = {
  active: boolean;
  endsAt: number | null;
  breachType: BreachType | null;
  reason: string;
};

export const StartCooldownSchema = z.object({
  breachType: BreachTypeSchema,
  reason: z.string().min(1),
});

export type StartCooldownInput = z.infer<typeof StartCooldownSchema>;

export const EMPTY_COOLDOWN: DisciplineCooldownState = {
  active: false,
  endsAt: null,
  breachType: null,
  reason: '',
};
