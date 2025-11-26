/**
 * Settings Server Actions
 * Server actions for loading and updating user settings
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserProfile } from '@/lib/auth/utils';
import type { UserSettings } from '@/types/settings.types';
import { DEFAULT_SETTINGS } from '@/types/settings.types';

interface ActionResult {
  success: boolean;
  error?: string;
  data?: UserSettings;
}

/**
 * Get current user settings
 */
export async function getUserSettings(): Promise<ActionResult> {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile) {
      return {
        success: false,
        error: 'User not authenticated',
      };
    }

    const supabase = await createClient();
    // Workaround: Type inference issue with profiles table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('profiles')
      .select('settings')
      .eq('user_id', profile.userId)
      .single() as { data: { settings?: UserSettings | null } | null; error: { message?: string } | null };

    if (error) {
      return {
        success: false,
        error: `Failed to fetch settings: ${error.message || 'Unknown error'}`,
      };
    }

    return {
      success: true,
      data: (data?.settings as UserSettings | null) || undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get auto-save preference (lightweight, for client components)
 * Server action that can be called from client components
 */
export async function getAutoSaveEnabled(): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return DEFAULT_SETTINGS.preferences?.autoSave ?? true;
    }

    // Get profile settings directly
    // Workaround: Type inference issue with profiles table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('settings')
      .eq('user_id', user.id)
      .single() as { data: { settings?: UserSettings | null } | null; error: unknown };

    if (!profile || !profile.settings) {
      return DEFAULT_SETTINGS.preferences?.autoSave ?? true;
    }

    const userSettings = profile.settings as Partial<UserSettings>;
    return userSettings.preferences?.autoSave ?? DEFAULT_SETTINGS.preferences?.autoSave ?? true;
  } catch {
    // On error, default to true
    return DEFAULT_SETTINGS.preferences?.autoSave ?? true;
  }
}

/**
 * Update user settings
 */
export async function updateUserSettings(
  settings: Partial<UserSettings>
): Promise<ActionResult> {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile) {
      return {
        success: false,
        error: 'User not authenticated',
      };
    }

    const supabase = await createClient();

    // Get current settings
    // Workaround: Type inference issue with profiles table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: currentProfile } = await (supabase as any)
      .from('profiles')
      .select('settings')
      .eq('user_id', profile.userId)
      .single() as { data: { settings?: UserSettings | null } | null; error: unknown };

    // Merge with existing settings
    const currentSettings = (currentProfile?.settings as Partial<UserSettings> | null) || {};
    const mergedSettings: UserSettings = {
      timezone: settings.timezone ?? currentSettings.timezone ?? DEFAULT_SETTINGS.timezone,
      notifications: {
        email: settings.notifications?.email ?? currentSettings.notifications?.email ?? DEFAULT_SETTINGS.notifications?.email ?? true,
        inApp: settings.notifications?.inApp ?? currentSettings.notifications?.inApp ?? DEFAULT_SETTINGS.notifications?.inApp ?? true,
        workflowRuns: settings.notifications?.workflowRuns ?? currentSettings.notifications?.workflowRuns ?? DEFAULT_SETTINGS.notifications?.workflowRuns ?? true,
        agentRuns: settings.notifications?.agentRuns ?? currentSettings.notifications?.agentRuns ?? DEFAULT_SETTINGS.notifications?.agentRuns ?? true,
      },
      preferences: {
        defaultModel: settings.preferences?.defaultModel ?? currentSettings.preferences?.defaultModel ?? DEFAULT_SETTINGS.preferences?.defaultModel,
        autoSave: settings.preferences?.autoSave ?? currentSettings.preferences?.autoSave ?? DEFAULT_SETTINGS.preferences?.autoSave ?? true,
      },
    };

    // Update settings
    // Workaround: Type inference issue with profiles table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update({ settings: mergedSettings })
      .eq('user_id', profile.userId);

    if (error) {
      return {
        success: false,
        error: `Failed to update settings: ${error.message}`,
      };
    }

    revalidatePath('/app/settings');
    revalidatePath('/app/account');

    return {
      success: true,
      data: mergedSettings,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
