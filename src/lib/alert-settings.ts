// @file src/lib/alert-settings.ts
/**
 * @overview [UI-ALERT-001] 알람 설정 Zod 스키마·타입·기본값. Server Action과 UI 공유.
 *
 * @call-flow
 * actions/alert-settings.ts → AlertSettingsSchema.safeParse → cachedSettings
 *
 * @see src/actions/alert-settings.ts, src/components/alert-setting-form.tsx
 */
import { z } from 'zod';

/** 손실폭(1–20%)·매매횟수 상한 검증 스키마 */
export const AlertSettingsSchema = z.object({
  lossLimit: z.number().int().min(1).max(20),
  tradeCap: z.number().int().min(1),
});

export type AlertSettingsInput = z.infer<typeof AlertSettingsSchema>;

export type AlertSettingsResult =
  | { success: true; data: AlertSettingsInput }
  | { success: false; error: string };

export const DEFAULT_ALERT_SETTINGS: AlertSettingsInput = {
  lossLimit: 5,
  tradeCap: 5,
};
