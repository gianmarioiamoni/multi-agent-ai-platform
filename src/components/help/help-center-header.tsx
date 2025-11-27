/**
 * Help Center Header
 * Header component for help center page
 * Following SRP: Only UI presentation, no logic
 * SSR: Fully server-side rendered
 */

export const HelpCenterHeader = () => {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
      <p className="text-muted-foreground">
        Find answers to common questions and learn how to get the most out of the platform.
      </p>
    </div>
  );
};

