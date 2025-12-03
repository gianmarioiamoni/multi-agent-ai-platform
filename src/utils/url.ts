/**
 * URL Utilities
 * Helper functions for URL handling and normalization
 */

/**
 * Normalize URL to ensure it has a protocol
 * @param url - URL string (with or without protocol)
 * @returns URL with protocol (https://)
 */
export function normalizeUrl(url: string | undefined): string {
  if (!url) {
    return 'https://multiagent.ai';
  }

  // Trim whitespace
  const trimmed = url.trim();

  // If already has protocol, return as is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Add https:// if missing
  return `https://${trimmed}`;
}

/**
 * Get app URL from environment variable, normalized
 * @returns Normalized app URL
 */
export function getAppUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  // If not set, return default
  if (!envUrl) {
    return 'https://multiagent.ai';
  }

  // Normalize the URL
  return normalizeUrl(envUrl);
}

/**
 * Get app URL and ensure it's valid for use in new URL()
 * This is a more defensive version that handles edge cases
 * @returns Normalized app URL guaranteed to work with new URL()
 */
export function getAppUrlSafe(): string {
  const url = getAppUrl();
  
  // Double-check: ensure it's a valid URL format
  try {
    new URL(url);
    return url;
  } catch {
    // If somehow still invalid, return default
    return 'https://multiagent.ai';
  }
}

