/**
 * Disabled Status Toggle Component
 * Toggle switch for enabling/disabling user accounts
 * Following SRP: Only handles disabled status toggle UI
 */

'use client';

import { Button } from '@/components/ui/button';

interface DisabledStatusToggleProps {
  isDisabled: boolean;
  disabled: boolean;
  onToggle: () => void;
}

export const DisabledStatusToggle = ({ 
  isDisabled, 
  disabled, 
  onToggle 
}: DisabledStatusToggleProps) => {
  if (isDisabled) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-500 font-medium">
          Disabled
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          disabled={disabled}
        >
          Enable
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-500 font-medium">
        Active
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        disabled={disabled}
      >
        Disable
      </Button>
    </div>
  );
};

