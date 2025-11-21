/**
 * Name Field Component
 * Input field for full name
 * Following SRP: Only handles name input UI
 */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NameFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const NameField = ({ value, onChange, disabled }: NameFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="name" required>
        Full Name
      </Label>
      <Input
        id="name"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your full name"
        required
        disabled={disabled}
      />
      <p className="text-xs text-[var(--color-muted-foreground)]">
        This is the name that will be displayed throughout the platform
      </p>
    </div>
  );
};

