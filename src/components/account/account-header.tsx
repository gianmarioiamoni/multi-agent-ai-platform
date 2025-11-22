/**
 * Account Header Component
 * Page header with title and description
 * Following SRP: Only handles header rendering
 */

export const AccountHeader = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-[var(--color-foreground)]">
        My Account
      </h1>
      <p className="text-[var(--color-muted-foreground)] mt-2">
        Manage your profile and preferences
      </p>
    </div>
  );
};

