import type { AlertSettingsInput } from '@/actions/alert-settings';
import type { BreachType } from '@/actions/discipline-cooldown';

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

export function getRemainingSeconds(endsAt: number | null): number {
  if (endsAt === null) return 0;
  return Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
}

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

export function writeStoredCooldown(state: StoredCooldown): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(COOLDOWN_STORAGE_KEY, JSON.stringify(state));
}

export function clearStoredCooldown(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(COOLDOWN_STORAGE_KEY);
}
