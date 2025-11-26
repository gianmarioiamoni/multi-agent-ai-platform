/**
 * Profile Server Actions
 * Actions for user profile management
 * Following SRP: Each action handles one specific profile task
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/utils';

interface UpdateProfileData {
  name: string;
}

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Update current user's profile
 */
export async function updateProfile(data: UpdateProfileData): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const supabase = await createClient();

    // Workaround: Type inference issue with profiles table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update({
        name: data.name,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (error) {
      return {
        success: false,
        error: `Failed to update profile: ${error.message}`,
      };
    }

    revalidatePath('/app/account');
    revalidatePath('/app/dashboard');
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

