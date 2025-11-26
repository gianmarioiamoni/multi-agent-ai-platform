/**
 * Demo Flag Toggle Component
 * Toggle switch for enabling/disabling demo flag
 * Following SRP: Only handles demo flag toggle UI
 */

'use client';

import { Button } from '@/components/ui/button';
import { DemoBadge } from '@/components/demo/demo-badge';

interface DemoFlagToggleProps {
  isDemo: boolean;
  disabled: boolean;
  onToggle: () => void;
}

export const DemoFlagToggle = ({ isDemo, disabled, onToggle }: DemoFlagToggleProps) => {
  if (isDemo) {
    return (
      <div className="flex items-center gap-2">
        <DemoBadge />
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          disabled={disabled}
        >
          Remove Demo
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      disabled={disabled}
    >
      Set as Demo
    </Button>
  );
};

