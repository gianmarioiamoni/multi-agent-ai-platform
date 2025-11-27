/**
 * Cookie Banner Message Component
 * Displays the cookie consent message
 * Following SRP: Only handles message rendering
 */

'use client';

export const CookieBannerMessage = () => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <svg
          className="w-5 h-5 text-[var(--color-primary)]"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 8.5c-.83 0-1.5-.67-1.5-1.5S9.17 7 10 7s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 0c-.83 0-1.5-.67-1.5-1.5S14.17 7 15 7s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-2.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm text-[var(--color-foreground)]">
          We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
          By clicking &quot;Accept All&quot;, you consent to our use of cookies.{' '}
          <a
            href="/privacy"
            className="text-[var(--color-primary)] hover:underline"
          >
            Learn more
          </a>
        </p>
      </div>
    </div>
  );
};

