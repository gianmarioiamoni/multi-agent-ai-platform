/**
 * Demo Restrictions Notice Component
 * Displays information about demo account restrictions
 * Following SRP: Only handles restrictions notice rendering
 */

export const DemoRestrictionsNotice = () => {
  return (
    <div className="p-6 rounded-lg bg-[var(--color-accent)]/10 border-2 border-[var(--color-accent)]/30">
      <div className="flex items-start gap-3">
        <svg
          className="w-6 h-6 text-[var(--color-accent)] mt-0.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-2">
            Demo Account Restrictions
          </h3>
          <p className="text-sm text-[var(--color-muted-foreground)] mb-3">
            This is a demo account. The following features are disabled:
          </p>
          <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
            <li className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-[var(--color-accent)] mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>
                <strong>Password changes</strong> are not allowed
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-[var(--color-accent)] mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>
                <strong>Account deletion</strong> is not allowed
              </span>
            </li>
          </ul>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-3 pt-3 border-t border-[var(--color-border)]">
            Contact support if you need to modify these settings.
          </p>
        </div>
      </div>
    </div>
  );
};

