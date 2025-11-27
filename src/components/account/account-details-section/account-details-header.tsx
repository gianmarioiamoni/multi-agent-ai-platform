/**
 * Account Details Header Component
 * Section header with title
 * Following SRP: Only handles header rendering
 */

interface AccountDetailsHeaderProps {
  title: string;
}

export const AccountDetailsHeader = ({ title }: AccountDetailsHeaderProps) => {
  return (
    <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-4">
      {title}
    </h2>
  );
};

