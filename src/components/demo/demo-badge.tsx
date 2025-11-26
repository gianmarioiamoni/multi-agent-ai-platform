/**
 * Demo Badge Component
 * Small badge to indicate demo mode
 * Following SRP: Only handles demo badge rendering
 */

export const DemoBadge = () => {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/30">
      <svg
        className="w-3 h-3"
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
      DEMO
    </span>
  );
};

