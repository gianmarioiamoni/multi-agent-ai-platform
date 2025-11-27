/**
 * Cookie Consent Hook
 * Manages cookie consent state and actions
 * Following SRP: Only handles consent logic
 */

'use client';

import { useState, useEffect } from 'react';
import {
  hasCookieConsent,
  acceptAllCookies,
  rejectOptionalCookies,
  type CookieConsentStatus,
  getCookieConsent,
} from '@/lib/cookies/storage';

interface UseCookieConsentReturn {
  consentStatus: CookieConsentStatus;
  hasConsented: boolean;
  showBanner: boolean;
  acceptCookies: () => void;
  rejectCookies: () => void;
}

/**
 * Hook for managing cookie consent state
 */
export const useCookieConsent = (): UseCookieConsentReturn => {
  const [consentStatus, setConsentStatus] = useState<CookieConsentStatus>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const status = getCookieConsent();
    const consented = hasCookieConsent();
    setConsentStatus(status);
    setHasConsented(consented);
  }, []);

  const showBanner = isMounted && !hasConsented && consentStatus === null;

  const acceptCookies = () => {
    acceptAllCookies();
    setConsentStatus('accepted');
    setHasConsented(true);
  };

  const rejectCookies = () => {
    rejectOptionalCookies();
    setConsentStatus('rejected');
    setHasConsented(true); // User has given consent (even if rejecting optional cookies)
  };

  return {
    consentStatus,
    hasConsented,
    showBanner,
    acceptCookies,
    rejectCookies,
  };
};

