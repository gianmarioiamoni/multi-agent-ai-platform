/**
 * Agent Role Component
 * Displays agent system prompt/role
 * Following SRP: Only handles role rendering
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AgentRoleProps {
  role: string;
}

export const AgentRole = ({ role }: AgentRoleProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Role</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-wrap bg-muted p-4 rounded border border-border">
          {role}
        </p>
      </CardContent>
    </Card>
  );
};

