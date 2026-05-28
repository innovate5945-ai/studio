'use server';

// @file src/actions/alert-settings.ts
/**
 * @overview [UI-ALERT-001] 알람 설정 Server Actions — 손실폭·매매횟수 임계값 조회/저장 (in-memory mock).
 *
 * @call-flow
 * 1. settings/page → AlertSettingForm mount → getAlertSettings()
 * 2. 폼 저장 → saveAlertSettings(input)
 * 3. AlertSettingsSchema.safeParse (lib) → 성공 시 cachedSettings 갱신 / 실패 시 error 반환
 *
 * @constraints "use server" — async function만 export. 스키마/타입은 lib/alert-settings.ts.
 * @see src/lib/alert-settings.ts, src/components/alert-setting-form.tsx, src/app/(dashboard)/settings/page.tsx
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
