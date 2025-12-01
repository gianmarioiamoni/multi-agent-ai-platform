/**
 * Workflow Triggers Component
 * Displays workflow triggers configuration
 * Following SRP: Only handles triggers rendering
 */

import type { WorkflowTriggers as WorkflowTriggersType } from '@/types/workflow.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface WorkflowTriggersProps {
  triggers: WorkflowTriggersType;
}

export const WorkflowTriggers = ({ triggers }: WorkflowTriggersProps) => {
  const triggerItems = [
    { key: 'manual', label: 'Manual', enabled: triggers.manual },
    { key: 'schedule', label: 'Schedule', enabled: !!triggers.schedule, value: triggers.schedule },
    { key: 'webhook', label: 'Webhook', enabled: triggers.webhook },
  ].filter((item) => item.enabled);

  if (triggerItems.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Triggers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {triggerItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.label}</span>
              {item.value ? <span className="text-sm text-muted-foreground">{item.value}</span> : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

