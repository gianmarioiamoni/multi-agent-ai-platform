/**
 * Demo Mode Banner Component
 * Displays a banner at the top of the page indicating demo mode
 * Following SRP: Only handles demo mode banner rendering
 */

export const DemoModeBanner = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[var(--color-accent)]/20 via-[var(--color-primary)]/20 to-[var(--color-accent)]/20 border-b border-[var(--color-accent)]/30 py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-sm">
          <svg
            className="w-5 h-5 text-[var(--color-accent)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-semibold text-[var(--color-foreground)]">
            Demo Mode
          </span>
          <span className="text-[var(--color-muted-foreground)]">
            — You are logged in with a demo account. Some features are restricted.
          </span>
        </div>
      </div>
    </div>
  );
};

