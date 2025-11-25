/**
 * Credentials Types
 * Type definitions for stored credentials and OAuth integrations
 */

export type CredentialProvider = 'google_calendar' | 'gmail' | 'outlook';

export interface StoredCredential {
  id: string;
  user_id: string;
  provider: CredentialProvider;
  encrypted_data: Buffer;
  is_active: boolean;
  expires_at: string | null;
  scopes: string[];
  created_at: string;
  updated_at: string;
}

export interface GoogleOAuthTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp
  scope: string;
  token_type: string;
}

export interface CredentialMetadata {
  provider: CredentialProvider;
  scopes: string[];
  expires_at: number | null;
}

