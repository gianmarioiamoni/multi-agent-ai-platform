/**
 * Credentials Encryption Utilities
 * Handles encryption/decryption of stored credentials
 * Following SRP: Only handles encryption logic
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Get encryption key from environment
 */
function getEncryptionKey(): Buffer {
  const key = process.env.CREDENTIALS_ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error(
      'CREDENTIALS_ENCRYPTION_KEY is not configured. ' +
      'Generate one with: openssl rand -base64 32'
    );
  }

  // Use the key directly if it's 32 bytes (base64 encoded)
  // Otherwise derive a key from it
  if (key.length === 44) {
    // Base64 encoded 32 bytes
    return Buffer.from(key, 'base64');
  }

  // Derive a key from the provided string
  return crypto
    .createHash('sha256')
    .update(key)
    .digest();
}

/**
 * Encrypt data for storage
 */
export function encryptCredentials(data: string): Buffer {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(data, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    const authTag = cipher.getAuthTag();
    
    // Combine: salt + iv + authTag + encrypted
    const result = Buffer.concat([
      iv,
      authTag,
      encrypted,
    ]);

    return result;
  } catch {
    throw new Error('Failed to encrypt credentials');
  }
}

/**
 * Decrypt stored data
 */
export function decryptCredentials(encryptedData: Buffer): string {
  try {
    const key = getEncryptionKey();
    
    // Extract components
    const iv = encryptedData.subarray(0, IV_LENGTH);
    const authTag = encryptedData.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = encryptedData.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8');
  } catch {
    throw new Error('Failed to decrypt credentials');
  }
}

