// @file src/lib/discipline.ts
/**
 * @overview [UI-ALERT-002] 규율 breach 평가·쿨타임 포맷·localStorage 동기화 (클라이언트 순수 함수).
 *
 * @call-flow
 * 1. DisciplineProvider: evaluateDisciplineBreach(sessionMetrics, settings)
 * 2. breach 시 → startDisciplineCooldown (actions) → writeStoredCooldown
 * 3. CooldownBanner: formatCooldownTime(timeLeft)
 *
 * @see src/contexts/discipline-provider.tsx
 */
import type { AlertSettingsInput } from '@/lib/alert-settings';
import type { BreachType } from '@/lib/discipline-cooldown';

export type SessionMetrics = {
  dailyLossPercent: number;
  tradeCount: number;
};

export type DisciplineBreach = {
  breachType: BreachType;
  reason: string;
};

export const DEFAULT_SESSION_METRICS: SessionMetrics = {
  dailyLossPercent: 0,
  tradeCount: 0,
};

/** 세션 지표가 알람 임계값을 초과했는지 평가합니다. */
export function evaluateDisciplineBreach(
  metrics: SessionMetrics,
  settings: AlertSettingsInput
): DisciplineBreach | null {
  if (metrics.dailyLossPercent >= settings.lossLimit) {
    return {
      breachType: 'loss_limit',
      reason: `당일 손실 ${metrics.dailyLossPercent}%가 설정 한도 ${settings.lossLimit}%를 초과했습니다.`,
    };
  }

  if (metrics.tradeCount >= settings.tradeCap) {
    return {
      breachType: 'trade_cap',
      reason: `당일 매매 ${metrics.tradeCount}회가 설정 상한 ${settings.tradeCap}회에 도달했습니다.`,
    };
  }

  return null;
}

/** 쿨타임 종료 시각까지 남은 초를 계산합니다. */
export function getRemainingSeconds(endsAt: number | null): number {
  if (endsAt === null) return 0;
  return Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
}

/** 초를 M:SS 형식으로 포맷합니다. */
export function formatCooldownTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const COOLDOWN_STORAGE_KEY = 'irontrader-discipline-cooldown';

export type StoredCooldown = {
  active: boolean;
  endsAt: number | null;
  breachType: BreachType | null;
  reason: string;
};

/** localStorage에서 쿨타임 상태를 읽습니다. */
export function readStoredCooldown(): StoredCooldown | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredCooldown;
  } catch {
    return null;
  }
}

/** localStorage에 쿨타임 상태를 저장합니다. */
export function writeStoredCooldown(state: StoredCooldown): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(COOLDOWN_STORAGE_KEY, JSON.stringify(state));
}

/** localStorage 쿨타임 상태를 삭제합니다. */
export function clearStoredCooldown(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(COOLDOWN_STORAGE_KEY);
}
