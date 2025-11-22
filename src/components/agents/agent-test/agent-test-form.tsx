/**
 * Agent Test Form Component
 * Form for submitting messages to test an agent
 * Following SRP: Only handles form UI and submission
 */

'use client';

import { useState, type FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface AgentTestFormProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const AgentTestForm = ({ onSubmit, isLoading, disabled = false }: AgentTestFormProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || isLoading || disabled) return;

    onSubmit(message.trim());
    setMessage(''); // Clear input after submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="agent-message"
          className="text-sm font-medium text-[var(--color-foreground)]"
        >
          Message
        </label>
        <Textarea
          id="agent-message"
          placeholder="Type your message to the agent..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading || disabled}
          fullWidth
          rows={4}
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isLoading}
        disabled={disabled || !message.trim()}
        fullWidth
      >
        {isLoading ? 'Executing...' : 'Send Message'}
      </Button>
    </form>
  );
};

