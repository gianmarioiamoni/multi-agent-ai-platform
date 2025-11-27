/**
 * Cookie Banner Button Component
 * Button for cookie consent actions
 * Following SRP: Only handles button rendering
 */

'use client';

import { Button } from '@/components/ui/button';

interface CookieBannerButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'outline';
  children: React.ReactNode;
}

export const CookieBannerButton = ({
  onClick,
  variant = 'primary',
  children,
}: CookieBannerButtonProps) => {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className="whitespace-nowrap"
    >
      {children}
    </Button>
  );
};

