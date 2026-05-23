'use server';

import { z } from 'zod';

export const COOLDOWN_DURATION_SECONDS = 30 * 60;

export const BreachTypeSchema = z.enum(['loss_limit', 'trade_cap']);
export type BreachType = z.infer<typeof BreachTypeSchema>;

export type DisciplineCooldownState = {
  active: boolean;
  endsAt: number | null;
  breachType: BreachType | null;
  reason: string;
};

const StartCooldownSchema = z.object({
  breachType: BreachTypeSchema,
  reason: z.string().min(1),
});

const EMPTY_COOLDOWN: DisciplineCooldownState = {
  active: false,
  endsAt: null,
  breachType: null,
  reason: '',
};

// TODO: Replace with Firestore when Authenticated Vault is wired up.
let cachedCooldown: DisciplineCooldownState = { ...EMPTY_COOLDOWN };

function hydrateCooldown(): DisciplineCooldownState {
  if (!cachedCooldown.active || cachedCooldown.endsAt === null) {
    return { ...cachedCooldown };
  }

  if (Date.now() >= cachedCooldown.endsAt) {
    cachedCooldown = { ...EMPTY_COOLDOWN };
  }

  return { ...cachedCooldown };
}

export async function getDisciplineCooldown(): Promise<DisciplineCooldownState> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return hydrateCooldown();
}

export async function startDisciplineCooldown(
  input: z.infer<typeof StartCooldownSchema>
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

export async function clearDisciplineCooldown(): Promise<DisciplineCooldownState> {
  cachedCooldown = { ...EMPTY_COOLDOWN };
  return { ...cachedCooldown };
}
