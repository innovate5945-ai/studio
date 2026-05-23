'use server';

import { z } from 'zod';

export const AlertSettingsSchema = z.object({
  lossLimit: z.number().int().min(1).max(20),
  tradeCap: z.number().int().min(1),
});

export type AlertSettingsInput = z.infer<typeof AlertSettingsSchema>;

export type AlertSettingsResult =
  | { success: true; data: AlertSettingsInput }
  | { success: false; error: string };

const DEFAULT_SETTINGS: AlertSettingsInput = {
  lossLimit: 5,
  tradeCap: 5,
};

// TODO: Replace with Firestore persistence when Authenticated Vault is wired up.
let cachedSettings: AlertSettingsInput = { ...DEFAULT_SETTINGS };

export async function getAlertSettings(): Promise<AlertSettingsInput> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { ...cachedSettings };
}

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
