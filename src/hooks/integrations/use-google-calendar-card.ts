/**
 * Google Calendar Card Hook
 * Handles Google Calendar integration logic and state
 * Following SRP: Only manages Google Calendar integration logic
 */

'use client';

import { useState } from 'react';
import { useToast } from '@/contexts/toast-context';

interface UseGoogleCalendarCardProps {
  onConnectionChange: () => Promise<void>;
}

interface UseGoogleCalendarCardReturn {
  isConnecting: boolean;
  isDisconnecting: boolean;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
}

/**
 * Hook for managing Google Calendar integration
 */
export function useGoogleCalendarCard({
  onConnectionChange,
}: UseGoogleCalendarCardProps): UseGoogleCalendarCardReturn {
  const { addToast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/integrations/google-calendar/auth-url');
      const data = (await response.json()) as { url?: string; error?: string };

      if (data.error || !data.url) {
        addToast('error', 'Connection Failed', data.error || 'Failed to get authorization URL');
        return;
      }

      window.location.href = data.url;
    } catch {
      addToast('error', 'Connection Failed', 'An unexpected error occurred');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (
      !confirm(
        'Are you sure you want to disconnect Google Calendar? Agents using this integration will stop working.'
      )
    ) {
      return;
    }

    setIsDisconnecting(true);
    try {
      const response = await fetch('/api/integrations/google-calendar/disconnect', {
        method: 'POST',
      });
      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!data.success) {
        addToast('error', 'Disconnect Failed', data.error || 'Failed to disconnect');
        return;
      }

      addToast('success', 'Disconnected', 'Google Calendar has been disconnected');
      await onConnectionChange();
    } catch {
      addToast('error', 'Disconnect Failed', 'An unexpected error occurred');
    } finally {
      setIsDisconnecting(false);
    }
  };

  return {
    isConnecting,
    isDisconnecting,
    handleConnect,
    handleDisconnect,
  };
}

