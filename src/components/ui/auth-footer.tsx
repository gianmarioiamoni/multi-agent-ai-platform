/**
 * Auth Footer Component
 * Footer with navigation link for auth forms
 * Following SRP: Only handles footer display
 */

import Link from 'next/link';

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkHref: string;
  disabled?: boolean;
}

export const AuthFooter = ({ text, linkText, linkHref, disabled = false }: AuthFooterProps) => {
  return (
    <div className="text-sm text-center text-muted-foreground">
      {text}{' '}
      <Link
        href={linkHref}
        className="text-primary hover:underline font-medium"
        tabIndex={disabled ? -1 : 0}
      >
        {linkText}
      </Link>
    </div>
  );
};

