/**
 * Button Styles Utilities
 * Shared button style constants for reuse across components
 * Following SRP: Only style definitions
 */

export const buttonBaseStyles = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2';

export const buttonVariantStyles = {
  primary: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90 shadow',
  secondary: 'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:opacity-90',
  outline: 'border border-[var(--color-input)] bg-[var(--color-background)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',
  ghost: 'hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',
  destructive: 'bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] hover:opacity-90 shadow',
} as const;

export const buttonSizeStyles = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 py-2',
  lg: 'h-11 px-8 text-lg',
} as const;

export const getButtonStyles = (
  variant: keyof typeof buttonVariantStyles = 'primary',
  size: keyof typeof buttonSizeStyles = 'md',
  className?: string
): string => {
  return `${buttonBaseStyles} ${buttonVariantStyles[variant]} ${buttonSizeStyles[size]} ${className || ''}`;
};

