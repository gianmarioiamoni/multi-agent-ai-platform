/**
 * Cookie Banner Actions Component
 * Action buttons container for cookie banner
 * Following SRP: Only handles actions layout
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CookieBannerButton } from './cookie-banner-button';

interface CookieBannerActionsProps {
  onAccept: () => void;
  onReject?: () => void;
}

export const CookieBannerActions = ({
  onAccept,
  onReject,
}: CookieBannerActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <Link href="/privacy/cookies">
        <Button variant="outline" size="sm" className="whitespace-nowrap">
          Customize
        </Button>
      </Link>
      {onReject ? <CookieBannerButton onClick={onReject} variant="outline">
          Reject
        </CookieBannerButton> : null}
      <CookieBannerButton onClick={onAccept} variant="primary">
        Accept All
      </CookieBannerButton>
    </div>
  );
};

