/**
 * Settings Header Component
 * Header section for settings page
 * Following SRP: Only handles header display
 */

export const SettingsHeader = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-[var(--color-foreground)]">Settings</h1>
      <p className="text-[var(--color-muted-foreground)] mt-2">
        Configure your application preferences and notifications
      </p>
    </div>
  );
};

