/**
 * Auto-Save Indicator Component
 * Minimal visual indicator for auto-save status
 * Following SRP: Only handles status display
 */

import type { AutoSaveStatus } from '@/hooks/shared/use-auto-save';

interface AutoSaveIndicatorProps {
  status: AutoSaveStatus;
  lastSavedAt: Date | null;
}

export const AutoSaveIndicator = ({ status, lastSavedAt }: AutoSaveIndicatorProps) => {
  if (status === 'idle' && !lastSavedAt) {
    return null; // Don't show anything if nothing has been saved yet
  }

  const getStatusDisplay = () => {
    switch (status) {
      case 'typing':
        return null; // Don't show anything while typing (avoid flickering)
      case 'saving':
        return {
          text: 'Saving...',
          className: 'text-[var(--color-muted-foreground)]',
        };
      case 'saved':
        return {
          text: 'Saved',
          className: 'text-green-600 dark:text-green-400',
        };
      case 'error':
        return {
          text: 'Save failed',
          className: 'text-red-600 dark:text-red-400',
        };
      default:
        return null;
    }
  };

  const statusDisplay = getStatusDisplay();

  if (!statusDisplay) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`flex items-center gap-1.5 ${statusDisplay.className}`}>
        {status === 'saving' && (
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {status === 'saved' && (
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {status === 'error' && (
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
        <span className="font-medium">{statusDisplay.text}</span>
      </div>
      {status === 'saved' && lastSavedAt && (
        <span className="text-xs text-[var(--color-muted-foreground)]">
          {formatTimeAgo(lastSavedAt)}
        </span>
      )}
    </div>
  );
};

/**
 * Format time ago (e.g., "2s ago", "1m ago")
 */
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) {
    return `${seconds}s ago`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

