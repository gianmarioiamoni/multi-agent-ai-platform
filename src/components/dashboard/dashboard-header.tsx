/**
 * Dashboard Header Component
 * Page header with welcome message and user name
 * Following SRP: Only handles header rendering
 */

interface DashboardHeaderProps {
  userName: string | null;
}

export const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  const displayName = userName || 'there';
  
  return (
    <div>
      <h1 className="text-4xl font-bold text-[var(--color-foreground)]">
        Dashboard
      </h1>
      <p className="text-[var(--color-muted-foreground)] mt-2">
        Welcome back, <span className="font-semibold text-[var(--color-foreground)]">{displayName}</span>! 
        Here&apos;s what&apos;s happening with your AI agents today.
      </p>
    </div>
  );
};

