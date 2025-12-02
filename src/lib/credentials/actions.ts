/**
 * Credentials Server Actions
 * CRUD operations for stored credentials
 * Following SRP: Only handles credentials database operations
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/utils';
import { encryptCredentials, decryptCredentials } from './encryption';
import type { CredentialProvider, GoogleOAuthTokens } from '@/types/credentials.types';

/**
 * Get stored credentials for a user and provider
 */
export async function getStoredCredential(
  provider: CredentialProvider
): Promise<{ data: GoogleOAuthTokens | null; error: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Workaround: Type inference issue with stored_credentials table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('stored_credentials')
      .select('encrypted_data')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .eq('is_active', true)
      .maybeSingle() as { data: { encrypted_data?: string } | null; error: { code?: string; message?: string } | null };

    if (error) {
      if (error.code === 'PGRST116') {
        return { data: null, error: 'Credential not found' };
      }
      return { data: null, error: error.message || 'Failed to retrieve credential' };
    }

    if (!data?.encrypted_data) {
      return { data: null, error: 'Credential not found' };
    }

    // Decrypt the credentials
    // Supabase BYTEA is returned as hex string (starts with \x) or base64
    let encryptedBuffer: Buffer;
    try {
      const encrypted = data.encrypted_data;
      
      if (Buffer.isBuffer(encrypted)) {
        encryptedBuffer = encrypted;
      } else if (typeof encrypted === 'string') {
        // Check if it's hex format (starts with \x)
        if (encrypted.startsWith('\\x')) {
          // Remove \x prefix and convert hex to buffer
          encryptedBuffer = Buffer.from(encrypted.slice(2), 'hex');
        } else {
          // Try base64
          encryptedBuffer = Buffer.from(encrypted, 'base64');
        }
      } else if (encrypted && typeof encrypted !== 'string' && 'length' in encrypted && 'byteLength' in encrypted) {
        // Handle Uint8Array or similar typed arrays
        encryptedBuffer = Buffer.from(encrypted as Uint8Array);
        encryptedBuffer = Buffer.from(encrypted);
      } else {
        return { data: null, error: 'Invalid credential format' };
      }
    } catch {
      return { data: null, error: 'Invalid credential format' };
    }

    let decrypted: string;
    let tokens: GoogleOAuthTokens;
    try {
      decrypted = decryptCredentials(encryptedBuffer);
      tokens = JSON.parse(decrypted) as GoogleOAuthTokens;
    } catch {
      return { data: null, error: 'Failed to decrypt credential' };
    }

    return { data: tokens, error: null };
  } catch {
    return { data: null, error: 'Failed to retrieve credential' };
  }
}

/**
 * Save or update stored credentials
 */
export async function saveStoredCredential(
  provider: CredentialProvider,
  tokens: GoogleOAuthTokens,
  scopes: string[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    let encryptedData: Buffer;
    try {
      encryptedData = encryptCredentials(JSON.stringify(tokens));
    } catch {
      return { success: false, error: 'Failed to encrypt credentials' };
    }

    // Calculate expiry
    const expiresAt = tokens.expires_at ? new Date(tokens.expires_at * 1000).toISOString() : null;

    const encryptedHex = '\\x' + encryptedData.toString('hex');
    
    // Workaround: Type inference issue with stored_credentials table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: _data, error } = await (supabase as any)
      .from('stored_credentials')
      .upsert(
        {
          user_id: user.id,
          provider,
          encrypted_data: encryptedHex,
          is_active: true,
          expires_at: expiresAt,
          scopes,
        },
        {
          onConflict: 'user_id,provider',
        }
      )
      .select();

    if (error) {
      return { success: false, error: `Failed to save credential: ${error.message}` };
    }

    revalidatePath('/app/integrations');
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

/**
 * Delete stored credentials
 */
export async function deleteStoredCredential(
  provider: CredentialProvider
): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('stored_credentials')
      .delete()
      .eq('user_id', user.id)
      .eq('provider', provider);

    if (error) {
      return { success: false, error: 'Failed to delete credential' };
    }

    revalidatePath('/app/integrations');
    return { success: true, error: null };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Check if user has active credentials for a provider
 */
export async function hasActiveCredential(
  provider: CredentialProvider
): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return false;
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('stored_credentials')
      .select('id')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .eq('is_active', true)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      return false;
    }

    return !!data;
  } catch {
    return false;
  }
}

