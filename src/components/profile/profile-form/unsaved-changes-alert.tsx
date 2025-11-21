/**
 * Unsaved Changes Alert Component
 * Alert to notify user of unsaved changes
 * Following SRP: Only handles alert UI
 */

interface UnsavedChangesAlertProps {
  show: boolean;
}

export const UnsavedChangesAlert = ({ show }: UnsavedChangesAlertProps) => {
  if (!show) return null;

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
      <svg className="w-5 h-5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-sm text-[var(--color-foreground)]">
        You have unsaved changes
      </p>
    </div>
  );
};

