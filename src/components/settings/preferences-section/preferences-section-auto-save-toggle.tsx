/**
 * Preferences Section Auto Save Toggle Component
 * Toggle switch for auto save preference
 * Following SRP: Only handles auto save toggle rendering
 */

'use client';

import { Label } from '@/components/ui/label';

interface PreferencesSectionAutoSaveToggleProps {
  checked: boolean;
  onToggle: () => void;
}

export const PreferencesSectionAutoSaveToggle = ({
  checked,
  onToggle,
}: PreferencesSectionAutoSaveToggleProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="space-y-0.5">
        <Label htmlFor="auto-save" className="text-base font-medium">
          Auto Save
        </Label>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Automatically save changes to agents and workflows as you work
        </p>
      </div>
      <button
        type="button"
        id="auto-save"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
          checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-muted)]'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

