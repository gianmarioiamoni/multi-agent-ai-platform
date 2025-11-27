/**
 * Preferences Section Header Component
 * Header with title and description
 * Following SRP: Only handles header rendering
 */

import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const PreferencesSectionHeader = () => {
  return (
    <CardHeader>
      <CardTitle>Preferences</CardTitle>
      <CardDescription>
        Set your default preferences for agents and workflows
      </CardDescription>
    </CardHeader>
  );
};

