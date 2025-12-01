/**
 * Input Component
 * Reusable input component with error handling
 * Following SRP: Only handles input presentation and styling
 */

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, fullWidth = false, type, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm',
            'ring-offset-[var(--color-background)] placeholder:text-[var(--color-muted-foreground)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50 transition-all',
            error && 'border-[var(--color-destructive)] focus-visible:ring-[var(--color-destructive)]',
            className
          )}
          ref={ref}
          {...props}
        />
        {error ? <p className="text-sm text-[var(--color-destructive)]" role="alert">
            {error}
          </p> : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

