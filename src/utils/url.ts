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

  // If already has protocol, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Add https:// if missing
  return `https://${url}`;
}

/**
 * Get app URL from environment variable, normalized
 * @returns Normalized app URL
 */
export function getAppUrl(): string {
  return normalizeUrl(process.env.NEXT_PUBLIC_APP_URL);
}

