/**
 * Cookie Banner Component
 * Main composition component for cookie consent banner
 * Following SRP: Only handles component composition
 */

'use client';

import { useCookieConsent } from '@/hooks/cookies/use-cookie-consent';
import { CookieBannerMessage } from './cookie-banner/cookie-banner-message';
import { CookieBannerActions } from './cookie-banner/cookie-banner-actions';

export const CookieBanner = () => {
  const { showBanner, acceptCookies, rejectCookies } = useCookieConsent();

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-card)] shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <CookieBannerMessage />
          </div>
          <CookieBannerActions onAccept={acceptCookies} onReject={rejectCookies} />
        </div>
      </div>
    </div>
  );
};

