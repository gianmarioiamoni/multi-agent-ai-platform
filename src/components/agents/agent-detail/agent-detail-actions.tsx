/**
 * Agent Detail Actions Component
 * Handles agent actions (edit, delete, test)
 * Following SRP: Only handles action logic and UI
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Agent } from '@/types/agent.types';
import { Button } from '@/components/ui/button';
import { deleteAgent } from '@/lib/agents/actions';
import { useToast } from '@/contexts/toast-context';

interface AgentDetailActionsProps {
  agent: Agent;
}

export const AgentDetailActions = ({ agent }: AgentDetailActionsProps) => {
  const router = useRouter();
  const { success, error: showError, info } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    const { success: deleteSuccess, error } = await deleteAgent(agent.id);

    if (error || !deleteSuccess) {
      showError('Error', error || 'Failed to delete agent');
      setIsDeleting(false);
      return;
    }

    success('Success', 'Agent deleted successfully');

    router.push('/app/agents');
  };

  const handleEdit = () => {
    router.push(`/app/agents/${agent.id}/edit`);
  };

  const handleTest = () => {
    router.push(`/app/agents/${agent.id}/test`);
  };

  return (
    <div className="flex items-center gap-2">
      {agent.status === 'active' && (
        <Button onClick={handleTest} size="sm">
          Test Agent
        </Button>
      )}
      <Button onClick={handleEdit} variant="outline" size="sm">
        Edit
      </Button>
      <Button
        onClick={handleDelete}
        variant="destructive"
        size="sm"
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  );
};

