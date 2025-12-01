/**
 * Label Component
 * Reusable label component for form fields
 * Following SRP: Only handles label presentation
 */

import type { LabelHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: ReactNode;
}

export const Label = ({ required, className, children, ...props }: LabelProps) => {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {required ? <span className="text-[var(--color-destructive)] ml-1">*</span> : null}
    </label>
  );
};

