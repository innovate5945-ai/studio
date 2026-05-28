'use server';

// @file src/actions/alert-settings.ts
/**
 * @overview [UI-ALERT-001] 알람 설정 Server Actions — 손실폭·매매횟수 임계값 조회/저장 (in-memory mock).
 *
 * @call-flow
 * 1. SettingsPage mount → getAlertSettings()
 * 2. AlertSettingForm 저장 → saveAlertSettings(input)
 *    → AlertSettingsSchema.safeParse (lib/alert-settings) → cachedSettings 갱신
 *
 * @constraints "use server" — async function만 export. 스키마/타입은 lib/alert-settings.ts.
 * @see src/lib/alert-settings.ts
 */
import {
  AlertSettingsSchema,
  DEFAULT_ALERT_SETTINGS,
  type AlertSettingsInput,
  type AlertSettingsResult,
} from '@/lib/alert-settings';

// TODO: Replace with Firestore persistence when Authenticated Vault is wired up.
let cachedSettings: AlertSettingsInput = { ...DEFAULT_ALERT_SETTINGS };

/** 서버 메모리 캐시에서 현재 알람 설정을 조회합니다. */
export async function getAlertSettings(): Promise<AlertSettingsInput> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { ...cachedSettings };
}

/** 알람 설정을 검증 후 서버 메모리 캐시에 저장합니다. */
export async function saveAlertSettings(
  input: AlertSettingsInput
): Promise<AlertSettingsResult> {
  const parsed = AlertSettingsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? 'Invalid alert settings.',
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
  cachedSettings = parsed.data;

  return { success: true, data: parsed.data };
}
