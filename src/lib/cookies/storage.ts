/**
 * Cookie Consent Storage Utilities
 * Handles persistence of GDPR-compliant cookie consent preferences
 */

const COOKIE_CONSENT_KEY = 'cookie-consent-preferences';

export type CookieCategory = 'necessary' | 'analytics' | 'marketing';

export interface CookiePreferences {
  necessary: boolean; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

export type CookieConsentStatus = 'accepted' | 'rejected' | null;

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true, // Always enabled
  analytics: false,
  marketing: false,
  timestamp: Date.now(),
};

/**
 * Get current cookie preferences from localStorage
 */
export const getCookiePreferences = (): CookiePreferences | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CookiePreferences;
      // Ensure necessary is always true
      parsed.necessary = true;
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Save cookie preferences to localStorage
 */
export const saveCookiePreferences = (preferences: Partial<CookiePreferences>): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const current = getCookiePreferences() || DEFAULT_PREFERENCES;
    const updated: CookiePreferences = {
      ...current,
      ...preferences,
      necessary: true, // Always enforce necessary cookies
      timestamp: Date.now(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is not available
  }
};

/**
 * Accept all cookies (GDPR compliant)
 */
export const acceptAllCookies = (): void => {
  saveCookiePreferences({
    necessary: true,
    analytics: true,
    marketing: true,
  });
};

/**
 * Reject optional cookies (only necessary cookies enabled)
 */
export const rejectOptionalCookies = (): void => {
  saveCookiePreferences({
    necessary: true,
    analytics: false,
    marketing: false,
  });
};

/**
 * Check if a specific category is enabled
 */
export const isCategoryEnabled = (category: CookieCategory): boolean => {
  const preferences = getCookiePreferences();
  if (!preferences) {
    return category === 'necessary'; // Only necessary cookies by default
  }
  return preferences[category] ?? false;
};

/**
 * Check if any consent has been given (for banner display)
 */
export const hasCookieConsent = (): boolean => {
  return getCookiePreferences() !== null;
};

/**
 * Get legacy consent status (for backward compatibility)
 */
export const getCookieConsent = (): CookieConsentStatus => {
  const preferences = getCookiePreferences();
  if (!preferences) {
    return null;
  }
  // Consider "accepted" if user has accepted any optional cookies
  if (preferences.analytics || preferences.marketing) {
    return 'accepted';
  }
  return 'rejected';
};

