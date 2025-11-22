/**
 * Admin Header Component
 * Page header with title and description
 * Following SRP: Only handles header rendering
 */

export const AdminHeader = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-[var(--color-foreground)]">
        Admin Panel
      </h1>
      <p className="text-[var(--color-muted-foreground)] mt-2">
        Platform administration and user management
      </p>
    </div>
  );
};

